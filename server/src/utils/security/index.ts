import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

import { Time } from "utils/time";
import { NumberUtils } from "utils/number";

import { EncodeOptions } from "types";

const privateKeys = {
  jwt: fs.readFileSync(path.resolve("src/utils/security/jwt_private.key")).toString()
}

/**
 * Use this method to create random ID.
 * @param prefix
 * @param numParts
 * @param numCharsInPart
 */
const getRandomID = (function() {
  let alphabet = "abcdefghijklmnopqrstuvw0123456789xyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabetN = alphabet.length;
  return function(prefix?: string, numParts: number = 3, numCharsInPart: number = 5) {
    let id = prefix ? prefix + "-" : "";
    for(let i = 0; i < numParts; i++) {
      for(let j = 0; j < numCharsInPart; j++) {
        id += alphabet[NumberUtils.getRandomNumber(0, alphabetN - 2)];
      }
      id += "-";
    }

    return id.substring(0, id.length - 1);
  }
})();

/**
 * Use to hash a `data` string.
 * @param data 
 * @returns 
 */
async function hash(data: string) {
  let salt = await bcrypt.genSalt();
  return bcrypt.hash(data, salt)
}

/**
 * Use to compare a `data` string with encrypted.
 * @param data 
 * @param encrypted 
 * @returns 
 */
async function compareHash(data: string, encrypted: string) {
  return bcrypt.compare(data, encrypted);
}

/**
 * Permissions
 */
const scopes: {[key: string]: string} = {
  admin: "all"
}

export const Security = {
  hash,
  compareHash,
  scopes,
  getRandomID
}