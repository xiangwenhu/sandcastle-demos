export function isString(value) {
    return typeof value === "string";
}

export function isFunction(value) {
    return typeof value === "function";
}

export function cleanBrackets(str) {
    // 移除最开头的左括号 '('
    str = str.replace(/^\(/, "");

    // 移除最末尾的右括号 ')' 或 ');'
    str = str.replace(/\);{0,1}$/, "");

    return str;
}
