import { createAsyncThunk } from '@reduxjs/toolkit';

// Import APIs
import { OtherAPIs } from 'src/apis/others';

// Import utils
import { LocalStorageUtils } from 'src/utils/localstorage';

/**
 * Use this async thunk to get ID for user.
 */
export const getPlayerIDAsyncThunk = createAsyncThunk(
  "/getPlayerIDAsyncThunk",
  async function() {
    let id = LocalStorageUtils.getItem<string>("playerId");

    if(!id) {
      id = (await OtherAPIs.getRandomIDAsync()).data.id;
      LocalStorageUtils.setItem("playerId", id);
    }

    return id;
  }
);