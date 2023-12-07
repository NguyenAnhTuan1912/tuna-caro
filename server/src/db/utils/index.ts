import { ObjectId } from "mongodb";

function getObjectId(id: string) {
  return new ObjectId(id);
}

function getQuery<T extends object>(q: T, cb?: (key: keyof T, value: T[keyof T]) => { [key: string]: any }) {
  let keys = Object.keys(q) as Array<keyof T>;
  let query = [];

  for(let key of keys) {
    // Some specific query
    if(key === "id" && keys.indexOf(key) !== -1) {
      query.push({ id: getObjectId(q[key] as string) });
      continue;
    }

    let customeQuery = !cb ? undefined : cb(key, q[key]);

    if(customeQuery) query.push(customeQuery);
    else query.push({ [key]: q[key] });
  }

  if(keys.length === 1) return query[0];
  return { $and: query };
}



export const MongoUtils = {
  /**
   * __Helper Function__
   * 
   * Use this function to create `ObjectId` from `string`.
   * @param id 
   * @returns 
   */
  getObjectId,
  /**
   * Use this function to get query object for mongo from query.
   * @param q 
   * @param cb 
   */
  getQuery
};