// Import from utils
import { BrowserStorageUtils, SessionStorageKeys } from "src/utils/browser_storage";

/**
 * Use this function to get data from with lang codes and key.
 * @param langCodes 
 * @param key 
 * @returns 
 */
export function getLangData<T>(langCodes: Array<string>, key: string): T {
  let obj: {[key: string]: any} = {};
  let langTexts = BrowserStorageUtils.getTempItem<T>(key);

  for(let langCode of langCodes) {
    if(langTexts && (langTexts as any)[langCode]) {
      obj[langCode as string] = (langTexts as any)[langCode];
    } else {
      obj[langCode as string] = undefined;
    }
  };

  return obj as T;
};

/**
 * Use this function to create loaded languages state.
 * @param langCodes 
 * @returns 
 */
export function createLoadedLangStatus(langCodes: Array<string>, langTexts: any) {
  const obj: {[key: string]: boolean} = {};

  for(let langCode of langCodes) {
    if(langTexts[langCode]) obj[langCode] = true;
    else obj[langCode] = false;
  }

  return obj;
}