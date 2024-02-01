"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberUtils = void 0;
/**
 * **NumberUtils**
 *
 * Use to get random number in [min, max].
 * @param min
 * @param max
 * @returns
 */
function getRandomNumber(min = 0, max = 10) {
  return Math.round(Math.random() * (max - min + 1));
}
exports.NumberUtils = {
  getRandomNumber
};