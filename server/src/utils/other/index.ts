/**
 * Use to wait a action.
 * @param cb 
 * @param time 
 * @returns 
 */
function wait(cb: () => void, time = 1000) {
  return new Promise((r) => {
    setTimeout(() => {
      r(cb());
    }, time);
  });
}

export const Other = {
  wait
}