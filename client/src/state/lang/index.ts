import { createSlice } from "@reduxjs/toolkit";

// Import from other classes
import { SettingsType } from "src/classes/Settings";

// Import constant
import { LANG_CODES } from "src/utils/constant";

// Import utils
import {
  BrowserStorageUtils,
  SessionStorageKeys,
  LocalStorageKeys
} from "src/utils/browser_storage";
import {
  createEmptyLangText,
  createLoadedLangStatus
} from "./utils";

// Import thunks
import { getLanguageAsyncThunk } from "./thunks/getLanguageAsyncThunk";

// Import types
import { RootState } from "..";
import { LangTextJSONType } from "src/types/lang.types";

const langeCodes = LANG_CODES;
export type LangCode = typeof langeCodes[number];
export type LangTexts = { [Key in LangCode]: LangTextJSONType };

/**
 * Use this function to create LangText for each lang code.
 * @param langCodes 
 * @returns 
 */
function getLangTexts(langCodes: Array<string>): LangTexts {
  let obj: {[key: string]: any} = {};
  let langTexts = BrowserStorageUtils.getTempItem<LangTexts>(SessionStorageKeys.lang);

  for(let langCode of langCodes) {
    if(langTexts && langTexts[langCode]) {
      obj[langCode as string] = langTexts[langCode];
    } else {
      obj[langCode as string] = undefined;
    }
  };

  return obj;
};

const initialLangTexts = getLangTexts(langeCodes);
const settings = BrowserStorageUtils.getItem<SettingsType>(LocalStorageKeys.settings);

export const LangSlice = createSlice({
  name: "lang",
  initialState: {
    defaultLang: langeCodes[0],
    currentLang:  (settings && settings.lang) ? settings.lang : langeCodes[0],
    text: initialLangTexts,
    loaded: createLoadedLangStatus(langeCodes, initialLangTexts)
  },
  reducers: {

  },
  extraReducers: function(build) {
    build.addCase(getLanguageAsyncThunk.pending, function(state, action) {
      state.currentLang = action.meta.arg;
    });

    build.addCase(getLanguageAsyncThunk.rejected, function(state, action) {
      state.currentLang = state.defaultLang;
    });

    build.addCase(getLanguageAsyncThunk.fulfilled, function(state, action) {
      let { payload } = action;
      
      // Update lang text.
      state.text[payload.langCode] = payload.data;
      state.loaded[payload.langCode] = true;

      // Update lang code.
      state.currentLang = payload.langCode;

      // Save lang to session storage.
      BrowserStorageUtils
      .updateTempItem(SessionStorageKeys.lang, { [state.currentLang]: state.text[state.currentLang] }, { canOverrideValues: false })
    });
  }
});

export type LangType = ReturnType<typeof LangSlice.getInitialState>;

/**
 * Use this selector to get text in `langCode` language for entire app.
 * @param state 
 * @param langCode 
 * @returns 
 */
export function langTextSelector(state: RootState, langCode: LangCode) {
  return state.lang.text[langCode];
}

/**
 * Use this selector to get entire state of lang.
 * @param state 
 * @returns 
 */
export function langSelector(state: RootState) {
  return state.lang;
}