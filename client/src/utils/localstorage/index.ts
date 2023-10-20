const StoreKeys = {
  "playerId": "_plyid",
  "playerName": "_plyn",
  "isDarkMode": "_idrkmde",
  "hasSoundWhenClickButton": "_hsndwcbtn",
  "hasSoundWhenClickTable": "_hsndwctb"
};

type Keys = keyof typeof StoreKeys;

/**
 * Use this function to get key of `StoreKeys`.
 * @param key 
 * @returns 
 */
function getKey(key: Keys) {
  return StoreKeys[key];
}

/**
 * Use this function to get data from storage.
 * @param key 
 * @returns 
 */
function getItem<T>(key: Keys) {
  let dataString = localStorage.getItem(getKey(key));

  if(!dataString) return null;

  return JSON.parse(dataString) as T;
}

/**
 * Use this function to save data in storage.
 * @param key 
 * @param data 
 */
function setItem(key: Keys, data: any) {
  data = JSON.stringify(data);
  localStorage.setItem(getKey(key), data);
}

/**
 * Use this function to remove data from storage.
 * @param key 
 * @returns 
 */
function removeItem(key: Keys) {
  localStorage.removeItem(getKey(key));
  return true;
}

/**
 * Give `index` to this function and receive the `index`-th item's name.
 * @param index 
 * @returns 
 */
function keyName(index: number) {
  return localStorage.key(index);
}

/**
 * Use this function to clear all items in storage.
 */
function clearAll() {
  localStorage.clear();
}

/**
 * Use this function to get length of local storage.
 * @returns 
 */
function getLength() {
  return localStorage.length;
}

export const LocalStorageUtils = {
  getItem,
  setItem,
  removeItem,
  keyName,
  clearAll,
  getLength
};