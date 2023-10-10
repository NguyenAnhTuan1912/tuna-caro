import { createSlice } from '@reduxjs/toolkit';

// Import classes
import { Game } from 'src/classes/Game';

// Import objects
import { MyMap } from 'src/objects/MyMap';

// Import types
import { ReduxAction } from '../state.types';

export const GameSlice = createSlice({
  name: "game",
  initialState: {
    self: null
  },
  reducers: {

  }
});