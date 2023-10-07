/**
 * This my is same as Map of Javascript, but has more convenient methods
 */
export class MyMap<K, V> extends Map<K, V> {
  /**
   * Use to map a MyMap to another type. Receive a callback and return an array of elements
   * that are returned by callback.
   * @param fn 
   * @returns 
   */
  map<R>(fn: (value: V | undefined, key: K) => R) {
    let rs: Array<R> = [];
    let keys = this.keys();
    for (let key of keys) {
      rs.push(fn(this.get(key), key));
    }

    return rs;
  }

  /**
   * Use to convert a MyMap to an object with keys as properties.
   * @returns
   */
  toObject(): object {
    let o: any = {};
    let keys = this.keys();
    for (let key of keys) {
      o[key] = this.get(key);
    }
    return o;
  }
}