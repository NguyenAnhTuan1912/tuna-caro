import { createAsyncThunk } from '@reduxjs/toolkit';

// Import APIs
import { OtherAPIs } from 'src/apis/others';

// Import utils
import { BrowserStorageUtils, SessionStorageKeys } from 'src/utils/browser_storage';

// Import types
import { RootState } from 'src/state';
import { LangTextJSONType } from 'src/types/lang.types';

/**
 * Use this async thunk to get ID for user.
 */
export const getLanguageAsyncThunk = createAsyncThunk(
  "/getLanguageAsyncThunk",
  async function(payload: string, thunkAPI) {
    let { lang } = thunkAPI.getState() as RootState;
    
    // If the requesting lang exist, the return it.
    if(lang.loaded[payload]) {
      return { langCode: payload, data: lang.text[payload] };
    };

    let responses = await OtherAPIs.getContentOfFileByNameAsync("text", payload + ".json");

    return { langCode: payload, data: responses as LangTextJSONType };
  }
);