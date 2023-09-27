interface FromCase$Case {
  case: boolean,
  returnValue: any
}

/**
 * This function allow performing a switch-case statement, but more flexible.
 * @param cases 
 * @returns 
 */
function fromCase(cases: Array<FromCase$Case>) {
  for(let c of cases) {
    if(c.case) {
      return typeof c.returnValue === "function" ? c.returnValue() : c.returnValue;
    }
  }
}

export const OtherUtils = {
  fromCase
};