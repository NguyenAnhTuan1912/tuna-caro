/**
 * Use to bind an object (not instance of class).
 * @param o 
 */
function autoBind(o: any) {
  let propNames = Object.getOwnPropertyNames(o);
  for(let propName of propNames) {
    if(typeof o[propName] === "function") {
      o[propName] = o[propName].bind(o);
    }
  }
  return o;
}

/**
 * Use to remove some props from `o`.
 * @param o 
 * @param propNames 
 * @returns 
 */
function removeProps(o: any, propNames: Array<string>) {
  for(let propName of propNames) {
    if(o[propName]) delete o[propName];
  }
  return o;
}

export const O = {
  autoBind,
  removeProps
}