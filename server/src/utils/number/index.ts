/**
 * **NumberUtils**
 * 
 * Use to get random number in [min, max].
 * @param min
 * @param max 
 * @returns 
 */
function getRandomNumber(min: number = 0, max: number = 10) {
  return Math.round(Math.random() * (max - min + 1));
}

export const NumberUtils = {
  getRandomNumber
}