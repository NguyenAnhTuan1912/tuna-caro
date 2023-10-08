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
  async function(state, api) {
    let id = LocalStorageUtils.getItem<string>("socketID");

    if(!id) {
      id = (await OtherAPIs.getRandomID()).data.id;
      LocalStorageUtils.setItem("socketID", id);
    }

    return id;
  }
);