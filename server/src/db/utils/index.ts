import { ObjectId } from "mongodb";

/**
 * __Helper Function__
 * 
 * Use this function to create `ObjectId` from `string`.
 * @param id 
 * @returns 
 */
function getObjectId(id: string) {
  return new ObjectId(id);
}

/**
 * Use this function to get query object for mongo from query.
 * @param q 
 * @param cb 
 */
function getQuery<T extends object>(q: T, cb?: (key: keyof T, value: T[keyof T]) => any) {
  let keys = Object.keys(q) as Array<keyof T>;
  let query = [];

  for(let key of keys) {
    // Some specific query
    if(key === "id" && keys.indexOf(key) !== -1) {
      query.push({ _id: getObjectId(q[key] as string) });
      continue;
    }

    let customeQuery = !cb ? undefined : cb(key, q[key]);

    if(!customeQuery) customeQuery = { [key]: q[key] };
    
    if(q[key]) query.push(customeQuery);
  }

  if(query.length === 0) return {};
  if(query.length === 1) return query[0];
  return { $and: query };
}



export const MongoUtils = {
  getObjectId,
  getQuery
};