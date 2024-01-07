import { createAsyncThunk } from '@reduxjs/toolkit';

// Import from classes
import { PlayerType } from 'src/classes/Player';

// Import APIs
import { OtherAPIs } from 'src/apis/others';

// Import utils
import { BrowserStorageUtils, LocalStorageKeys } from 'src/utils/browser_storage';

/**
 * Use this async thunk to get ID for user.
 */
export const getPlayerIDAsyncThunk = createAsyncThunk(
  "/getPlayerIDAsyncThunk",
  async function() {
    let player = BrowserStorageUtils.getItem<PlayerType>(LocalStorageKeys.player);
    let id = player?.id;
    if(!id) {
      id = (await OtherAPIs.getRandomIDAsync()).data.id;
    };

    return id;
  }
);