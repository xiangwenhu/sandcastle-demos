import * as parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

// 定义危险的标识符
const dangerousIdentifiers = [
    'require', 'process', 'global', 'Buffer', '__dirname', '__filename',
    'module', 'exports', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
    'fs', 'child_process', 'net', 'http', 'https', 'dns', 'crypto', 'os', 'path'
];
const regExpText = [
    'require', 'process', 'global', 'Buffer', '__dirname', '__filename',
    'module', 'exports', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
    'fs', 'child_process', 'dns', 'crypto',
]

function checkAstCode(code: string) {
    const lcode = code.toLowerCase();
    return dangerousIdentifiers.some(c => lcode.includes(c))
}

function checkCode(code: string) {
    const lcode = code.toLowerCase();
    return regExpText.some(c => lcode.includes(c))
}

// 存储变量引用及其对应的值或模块
const variableReferences = new Map<string, string>();

export function containsDangerousCode(code: string): boolean {
    try {

        // 正则检测
        const danger = checkCode(code)
        if (danger) return true;


        // 解析代码为AST
        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['typescript'] // 如果需要支持TypeScript语法
        });

        let isDangerous = false;

        // 检查是否包含危险操作
        function checkDangerousCall(path: NodePath<t.CallExpression>): boolean {
            const callee = path.node.callee;

            if (t.isIdentifier(callee)) {
                return checkAstCode(callee.name);
            } else if (t.isMemberExpression(callee)) {
                let objectName: string | undefined;
                let propertyName: string | undefined;

                // 处理对象部分
                const objectPath = path.get('callee.object');
                if (Array.isArray(objectPath)) {
                    if (objectPath.length > 0) {
                        objectName = getObjectOrPropertyName(objectPath[0]);
                    }
                } else if (objectPath) {
                    objectName = getObjectOrPropertyName(objectPath);
                }

                // 处理属性部分
                if (t.isIdentifier(callee.property)) {
                    propertyName = callee.property.name;
                } else if (t.isStringLiteral(callee.property)) {
                    propertyName = callee.property.value;
                }

                if (objectName !== undefined && propertyName !== undefined) {
                    return checkAstCode(`${objectName}.${propertyName}`);
                }
            }

            return false;
        }

        // 检查成员表达式是否包含危险的操作
        function checkDangerousMember(path: NodePath<t.MemberExpression>): boolean {
            let objectName: string | undefined;
            let propertyName: string | undefined;

            // 处理对象部分
            const objectPath = path.get('object');
            if (Array.isArray(objectPath)) {
                if (objectPath.length > 0) {
                    objectName = getObjectOrPropertyName(objectPath[0]);
                }
            } else if (objectPath) {
                objectName = getObjectOrPropertyName(objectPath);
            }

            // 处理属性部分
            if (t.isIdentifier(path.node.property)) {
                propertyName = path.node.property.name;
            } else if (t.isStringLiteral(path.node.property)) {
                propertyName = path.node.property.value;
            }

            if (objectName !== undefined && propertyName !== undefined) {
                return checkAstCode(`${objectName}.${propertyName}`);
            }

            return false;
        }

        // 辅助函数：获取对象或属性名称
        function getObjectOrPropertyName(path: NodePath): string | undefined {
            if (t.isIdentifier(path.node)) {
                return path.node.name;
            } else if (t.isMemberExpression(path.node)) {
                return getFullMemberExpressionName(path as NodePath<t.MemberExpression>);
            }
            return undefined;
        }

        // 辅助函数：获取完整成员表达式的名称
        function getFullMemberExpressionName(path: NodePath<t.MemberExpression>): string {
            let nameParts: string[] = [];

            function traverseMemberExpression(exprPath: NodePath<t.MemberExpression>) {
                if (t.isMemberExpression(exprPath.node.object)) {
                    traverseMemberExpression(exprPath.get('object') as NodePath<t.MemberExpression>);
                } else if (t.isIdentifier(exprPath.node.object)) {
                    nameParts.push(exprPath.node.object.name);
                }

                if (t.isIdentifier(exprPath.node.property)) {
                    nameParts.push(exprPath.node.property.name);
                } else if (t.isStringLiteral(exprPath.node.property)) {
                    nameParts.push(exprPath.node.property.value);
                }
            }

            traverseMemberExpression(path);
            return nameParts.join('.');
        }

        // 遍历AST并填充variableReferences
        traverse(ast, {
            VariableDeclarator(path) {
                const id = path.node.id;
                const init = path.node.init;

                if (init && t.isCallExpression(init) && t.isIdentifier(init.callee) && init.callee.name === 'require') {
                    // 处理类似 `const fs = require('fs')` 的情况
                    const moduleName = (init.arguments[0] as t.StringLiteral).value;
                    if (typeof moduleName === 'string' && checkAstCode(moduleName)) {
                        if (t.isIdentifier(id)) {
                            variableReferences.set(id.name, moduleName);
                        }
                    }
                }
            },
            AssignmentExpression(path) {
                const left = path.node.left;
                const right = path.node.right;

                if (t.isIdentifier(left) && t.isCallExpression(right) && t.isIdentifier(right.callee) && right.callee.name === 'require') {
                    // 处理类似 `fs = require('fs')` 的情况
                    const moduleName = (right.arguments[0] as t.StringLiteral).value;
                    if (typeof moduleName === 'string' && checkAstCode(moduleName)) {
                        variableReferences.set(left.name, moduleName);
                    }
                }
            },
            CallExpression(path) {
                if (checkDangerousCall(path)) {
                    isDangerous = true;
                    path.stop(); // 停止进一步遍历
                }
            },
            MemberExpression(path) {
                if (checkDangerousMember(path)) {
                    isDangerous = true;
                    path.stop(); // 停止进一步遍历
                }
            },
            Identifier(path) {
                // 检查是否引用了之前记录下来的危险模块或全局对象
                if (variableReferences.has(path.node.name)) {
                    isDangerous = true;
                    path.stop(); // 停止进一步遍历
                }
            }
        });

        return isDangerous;
    } catch (error: any) {
        console.error("Error in code analysis:", error.message);
        return true; // 如果有错误，假设代码可能是危险的
    }
}