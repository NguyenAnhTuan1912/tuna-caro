import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

import { Time } from "utils/time";

import { EncodeOptions } from "types";

const privateKeys = {
  jwt: fs.readFileSync(path.resolve("src/utils/security/jwt_private.key")).toString()
}

/**
 * Cipher pattern:
 * data_cipher:expired_date_cipher:created_date_cipher
 */

/**
 * Use to encode an `data` to `token`.
 * @param data 
 * @param key 
 * @param options 
 * @returns 
 */
function encode(data: any, options?: EncodeOptions) {
  try {
    // const fullExp = Date.now() + options?.expireTime * 1000;
    // const exp = Math.floor(fullExp / 1000);
    options = Object.assign<EncodeOptions, EncodeOptions | undefined>(
      {
        expireTime: "1h"
      },
      options
    );
    const payload = {
      ...data
    };

    const token = jwt.sign(payload, privateKeys.jwt, { expiresIn: options?.expireTime });
    return token;
  } catch (error) {
    return "";
  }
};

/**
 * Use to verify a token, and return the `payload`.
 * @param data 
 * @param key 
 */
function verify(token: string) {
  try {
    let payload = jwt.verify(token, privateKeys.jwt);
    return payload;
  } catch (error) {
    return undefined;
  }
};

/**
 * Use to decode a `token` to `data` (payload).
 * @param token 
 * @returns 
 */
function decode(token: string) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return undefined;
  }
};

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
  encode,
  decode,
  verify,
  hash,
  compareHash,
  scopes
}