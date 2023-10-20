import { createSlice } from '@reduxjs/toolkit';

// Import classes
import { st, SFXSettingKeysType, SFXSettingsType, Settings } from 'src/classes/Settings';

// Import objects
// import { MyMap } from 'src/objects/MyMap';

// Import types
import { ReduxAction } from '../state.types';

/**
 * Slice of settings. This slice will take over the responsibility about settings in game.
 * All the settings will be store in the local.
 */
export const SettingsSlice = createSlice({
  name: "settings",
  initialState: {
    // /**
    //  * Is app in dark mode or not?
    //  */
    // isDarkMode: false,
    // /**
    //  * Sound effect settings.
    //  */
    // sfx: {
    //   hasSoundWhenClickTable: true,
    //   hasSoundWhenClickButton: true
    // } as SFXSettingsType,
    // /**
    //  * Language of app.
    //  */
    // lang: languageMap.get("vie")
    self: st
  },
  reducers: {
    /**
     * Use this action to toggle sound setting when hit table.
     * @param state 
     * @param action 
     */
    setSFXStatusAction: function(state, action: ReduxAction<{ sound: SFXSettingKeysType, status?: boolean }>) {
      state.self.setSFX(action.payload.sound, action.payload.status ? action.payload.status : false);
    },

    /**
     * Use this action to toggle the status of `dark mode`.
     * @param state 
     * @param action 
     */
    toggleDarkModeAction: function(state, action: ReduxAction<undefined>) {
      state.self.toggleTheme();
    }
  }
});

export const {
  setSFXStatusAction,
  toggleDarkModeAction
} = SettingsSlice.actions;

/**
 * Use this selector to get state of sfx settings.
 * @param state 
 * @returns 
 */
export function sfxSettingsSelector(state: any): SFXSettingsType {
  return state.settings.self.sfx;
}

/**
 * Use this selector to get state of dark mode.
 * @param state 
 * @returns 
 */
export function darkModeSettingsSelector(state: any): boolean {
  return state.settings.self.isDarkMode;
}

/**
 * Use this selector to get state of settings.
 * @param state 
 * @returns 
 */
export function settingsSelector(state: any): Settings {
  return state.settings.self;
}