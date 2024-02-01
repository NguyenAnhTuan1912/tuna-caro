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
  getLangData,
  createLoadedLangStatus
} from "./utils";

// Import thunks
import { getLanguageAsyncThunk } from "./thunks/getLanguageAsyncThunk";

// Import types
import { RootState } from "..";
import { LangTextJSONType, LangAboutJSONType } from "src/types/lang.types";

const langeCodes = LANG_CODES;
export type LangCode = typeof langeCodes[number];
export type LangTexts = { [Key in LangCode]: LangTextJSONType };
export type LangAbouts = { [Key in LangCode]: LangAboutJSONType }

const initialLangTexts = getLangData<LangTexts>(langeCodes, SessionStorageKeys.langText);
const initialLangAbouts = getLangData<LangAbouts>(langeCodes, SessionStorageKeys.langAbout);
const settings = BrowserStorageUtils.getItem<SettingsType>(LocalStorageKeys.settings);

export const LangSlice = createSlice({
  name: "lang",
  initialState: {
    defaultLang: langeCodes[0],
    currentLang:  (settings && settings.lang) ? settings.lang : langeCodes[0],
    text: initialLangTexts,
    about: initialLangAbouts,
    loaded: createLoadedLangStatus(langeCodes, initialLangTexts)
  },
  reducers: {

  },
  extraReducers: function(build) {
    build.addCase(getLanguageAsyncThunk.pending, function(state, action) {
      state.currentLang = action.meta.arg;
    });

    build.addCase(getLanguageAsyncThunk.rejected, function(state) {
      state.currentLang = state.defaultLang;
    });

    build.addCase(getLanguageAsyncThunk.fulfilled, function(state, action) {
      let { payload } = action;
      
      // Update lang text.
      state.text[payload.langCode] = payload.text;
      
      // Update lang about.
      state.about[payload.langCode] = payload.about;
      
      // Update loading status.
      state.loaded[payload.langCode] = true;

      // Update lang code.
      state.currentLang = payload.langCode;

      // Save lang to session storage.
      BrowserStorageUtils
      .updateTempItem(SessionStorageKeys.langText, {[state.currentLang]: state.text[state.currentLang]}, { canOverrideValues: false })
      BrowserStorageUtils
      .updateTempItem(SessionStorageKeys.langAbout, {[state.currentLang]: state.about[state.currentLang]}, { canOverrideValues: false })
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