import { createAsyncThunk } from '@reduxjs/toolkit';

// Import APIs
import { OtherAPIs } from 'src/apis/others';

// Import from utils
import { GDRIVE_FOLDERS } from 'src/utils/constant';

// Import types
import { RootState } from 'src/state';
import { LangTextJSONType, LangAboutJSONType } from 'src/types/lang.types';

/**
 * Use this async thunk to get ID for user.
 */
export const getLanguageAsyncThunk = createAsyncThunk(
  "/getLanguageAsyncThunk",
  async function(payload: string, thunkAPI) {
    let { lang } = thunkAPI.getState() as RootState;
    
    // If the requesting lang exist, the return it.
    if(lang.loaded[payload]) {
      return { langCode: payload, text: lang.text[payload], about: lang.about[payload] as LangAboutJSONType };
    };

    let responses = await Promise.all([
      OtherAPIs.getContentOfFileByNameAsync(GDRIVE_FOLDERS.VITE_GDRIVE_TEXT, payload + ".json"),
      OtherAPIs.getContentOfFileByNameAsync(GDRIVE_FOLDERS.VITE_GDRIVE_ABOUT, payload + ".json")
    ]);

    let [text, about] = responses;

    return { langCode: payload, text: text as LangTextJSONType, about: about as LangAboutJSONType };
  }
);