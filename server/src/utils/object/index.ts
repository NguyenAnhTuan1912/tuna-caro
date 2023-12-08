/**
 * Use this function to bind an object (not instance of class).
 * @param o 
 */
function autoBind(o: any, hasPrototype: boolean = false) {
  let propNames = Object.getOwnPropertyNames(hasPrototype ? Object.getPrototypeOf(o) : o);
  for(let propName of propNames) {
    if(typeof o[propName] === "function") {
      o[propName] = o[propName].bind(o);
    }
  }
  return o;
}

/**
 * Use this function to remove some props from `o`.
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

/**
 * Use this function to remove props that have falsy value.
 * @param o 
 */
function removeFalsyProps(o: any) {
  for(let key in o) {
    if(!Boolean(o[key]) && o[key] !== 0 && o[key] !== "") delete o[key];
  }
  return o;
}

export const O = {
  autoBind,
  removeProps,
  removeFalsyProps
}