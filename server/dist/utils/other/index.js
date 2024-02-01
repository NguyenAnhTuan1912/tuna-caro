"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Other = void 0;
/**
 * Use to wait a action.
 * @param cb
 * @param time
 * @returns
 */
function wait(cb, time = 1000) {
  return new Promise((r) => {
    setTimeout(() => {
      r(cb());
    }, time);
  });
}
exports.Other = {
  wait
};