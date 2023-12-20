// Import types
import { ToStringOptions } from "./index.types";

/**
 * Use this function to set default values for `o` using `ext`.
 * @param o 
 * @param s 
 */
function setDefaultValues<T>(o: T, ext: T) {
  if(!Boolean(o)) return ext!;
  for(let key in ext) {
    if(!o[key]) {
      o[key] = ext[key]!;
    }
  }
  return o!;
}

/**
 * Use this function to convert an object to string.
 * @param o 
 * @example
 * ```
 * let obj = {
 *   name: "Nguyen Anh Tuan",
 *   age: 19
 * };
 * 
 * let str = ObjectUtils.toString(obj);
 * 
 * // Output: name=Nguyen Anh Tuan;age=19
 * console.log(str);
 * ```
 */
function toString(o: {[key: string]: any}, opt?:ToStringOptions) {
  let str = "";

  opt = setDefaultValues(opt, { kvSeperator: "=", seperator: "&" });

  for(let key in o) {
    if(Boolean(o[key]) && typeof o[key] !== "object" && typeof o[key] !== "object" && typeof o[key] !== "symbol") {
      let propStr = key + opt?.kvSeperator + o[key];
      str += propStr + opt?.seperator;
    } 
  }
  return str;
}

export const ObjectUtils = {
  toString,
  setDefaultValues
};