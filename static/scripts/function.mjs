import { isFunction } from "./util.mjs";

// 定义正则表达式模式来匹配不同形式的函数定义
const REG_COMMON_FUNCTION = /^function\s*[^\{]*\{([\s\S]*)\}$/; // 匹配普通函数定义
const REG_ARROW_FUNCTION = /^$[^$]*\)\s*=>\s*(?:\{([\s\S]*)\}|(.+))$/; // 匹配箭头函数定义
const REG_METHOD_FUNCTION = /^[^{]+\{([\s\S]*)\}$/; // 匹配类方法或对象字面量中的方法

export function getFunctionBody(fn) {
  if (typeof fn !== "function") return "";

  const fnStr = fn.toString().trim();

  // 尝试匹配普通函数定义
  let matches = fnStr.match(REG_COMMON_FUNCTION);
  if (matches && matches.length > 1) {
    return matches[1].trim();
  }

  // 尝试匹配箭头函数定义
  matches = fnStr.match(REG_ARROW_FUNCTION);
  if (matches) {
    // 箭头函数可能有两种形式：带大括号或不带大括号
    return (matches[1] || matches[2]).trim();
  }

  // 尝试匹配类方法或对象字面量中的方法
  matches = fnStr.match(REG_METHOD_FUNCTION);
  if (matches && matches.length > 1) {
    return matches[1].trim();
  }

  // 如果无法识别，则返回 null
  return "";
}

export const AsyncFunctionConstructor = async function fn() {}.constructor;

export const GeneratorFunctionConstructor = function* () {}.constructor;

export const AsyncGeneratorFunctionConstructor = async function* () {}
  .constructor;

export function isGeneratorFunction(fn) {
  if (!isFunction(fn)) return false;
  return fn.constructor === GeneratorFunctionConstructor;
}

export function isAsyncGeneratorFunction(fn) {
  if (!isFunction(fn)) return false;
  return fn.constructor === AsyncGeneratorFunctionConstructor;
}

export function isAsyncFunction(fn) {
  if (!isFunction(fn)) return false;
  return fn.constructor === AsyncFunctionConstructor;
}

export function isArrowFunction(fn) {
  if (!isFunction(fn)) return false;
  // 箭头函数没有 prototype 属性，或者它不是对象类型
  if (fn.hasOwnProperty("prototype") && typeof fn.prototype === "object") {
    return false;
  }

  // 检查函数定义字符串是否以括号开始，这是箭头函数的特点之一
  const fnString = fn.toString().trim();
  // 检查是否为箭头函数定义（以括号开始，但不是 function 关键字）
  return /^[(]/.test(fnString) && !/^function/.test(fnString);
}

export function isNormalFunction(fn) {
  if (!isFunction(fn)) return false;

  // 如果函数的构造器是普通的 Function 构造器，则继续检查
  if (fn.constructor === Function) {
    // 不是箭头函数
    if (isArrowFunction(fn)) {
      return false;
    }

    // 如果到达这里，则认为是普通函数
    return true;
  }

  // 对于其他已知的特殊类型的构造器，默认认为不是普通函数
  return false;
}
