type ValueType<Name, T> = {
  "value": T;
  "key": string;
  "both": [string, T]
};

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
   * Use this method to get an __array__ of value from `from` index to `to` index.
   * Have a option for kind of return value (key, value or both).
   * @param from 
   * @param to 
   */
  inRange<R>(from?: number, to?: number, valueType: "key" | "value" | "both" = "value") {
    let result = [];
    let pointer = 0;
    let entries = this.entries();

    if(!from) from = 0;
    if(!to) to = this.size;

    for(let entry of entries) {
      if(pointer >= from! && pointer <= to!) {
        if(valueType === "value") {
          result.push(entry[1]);
        }

        if(valueType === "key") {
          result.push(entry[0]);
        }

        if(valueType === "both") {
          result.push(entry);
        }

      }

      if(pointer > to) break;

      pointer += 1;
    }

    return result as R;
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