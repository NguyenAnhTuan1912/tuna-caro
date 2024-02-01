"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUtils = void 0;
const mongodb_1 = require("mongodb");
/**
 * __Helper Function__
 *
 * Use this function to create `ObjectId` from `string`.
 * @param id
 * @returns
 */
function getObjectId(id) {
  return new mongodb_1.ObjectId(id);
}
/**
 * Use this function to get query object for mongo from query.
 * @param q
 * @param cb
 */
function getQuery(q, cb) {
  let keys = Object.keys(q);
  let query = [];
  for (let key of keys) {
    // Some specific query
    if (key === "id" && keys.indexOf(key) !== -1) {
      query.push({ _id: getObjectId(q[key]) });
      continue;
    }
    let customeQuery = !cb ? undefined : cb(key, q[key]);
    if (!customeQuery)
    customeQuery = { [key]: q[key] };
    if (q[key])
    query.push(customeQuery);
  }
  if (query.length === 0)
  return {};
  if (query.length === 1)
  return query[0];
  return { $and: query };
}
exports.MongoUtils = {
  getObjectId,
  getQuery
};