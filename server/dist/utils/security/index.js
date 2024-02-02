"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Security = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const number_1 = require("../number");
/**
 * Use this method to create random ID.
 * @param prefix
 * @param numParts
 * @param numCharsInPart
 */
const getRandomID = function () {
  let alphabet = "abcdefghijklmnopqrstuvw0123456789xyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabetN = alphabet.length;
  return function (prefix, numParts = 3, numCharsInPart = 5) {
    let id = prefix ? prefix + "-" : "";
    for (let i = 0; i < numParts; i++) {
      for (let j = 0; j < numCharsInPart; j++) {
        id += alphabet[number_1.NumberUtils.getRandomNumber(0, alphabetN - 2)];
      }
      id += "-";
    }
    return id.substring(0, id.length - 1);
  };
}();
/**
 * Use to hash a `data` string.
 * @param data
 * @returns
 */
function hash(data) {
  return __awaiter(this, void 0, void 0, function* () {
    let salt = yield bcrypt_1.default.genSalt();
    return bcrypt_1.default.hash(data, salt);
  });
}
/**
 * Use to compare a `data` string with encrypted.
 * @param data
 * @param encrypted
 * @returns
 */
function compareHash(data, encrypted) {
  return __awaiter(this, void 0, void 0, function* () {
    return bcrypt_1.default.compare(data, encrypted);
  });
}
/**
 * Permissions
 */
const scopes = {
  admin: "all"
};
exports.Security = {
  hash,
  compareHash,
  scopes,
  getRandomID
};