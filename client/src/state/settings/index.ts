import { createSlice } from '@reduxjs/toolkit';

// Import classes
import { SFXSettingKeysType, SFXSettingsType, Settings, SettingsType } from 'src/classes/Settings';
import { ColorTheme, defaultDarkTheme } from 'src/classes/ColorTheme';

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
    self: Settings.createSettings()
  },
  reducers: {
    /**
     * Use this action to toggle sound setting when hit table.
     * @param state 
     * @param action 
     */
    setSFXStatusAction: function(state, action: ReduxAction<{ sound: SFXSettingKeysType, status?: boolean }>) {
      Settings.setSFX(
        state.self,
        action.payload.sound, action.payload.status ? action.payload.status : false
      );
    },

    /**
     * Use this action to toggle the status of `dark mode`.
     * @param state 
     * @param action 
     */
    toggleDarkModeAction: function(state, action: ReduxAction<undefined>) {
      Settings.toggleTheme(state.self);
    },

    /**
     * __Note__: This action is not affect the state.
     * 
     * Use this action to perform tasks requiring settings.
     * @param state 
     * @param action 
     */
    performTasksRequireSettingsAction: function(state, action: ReduxAction<undefined>) {
      /*
        There are 2 tasks:
        - Theme
        - Language

        Because they are affect to UI, so we need to perform their task depend on settings.
      */

      // Theme
      if(state.self.isDarkMode) {
        ColorTheme.enableTheme(defaultDarkTheme);
      } else {
        ColorTheme.unableTheme();
      }
    }
  }
});

export const {
  setSFXStatusAction,
  toggleDarkModeAction,
  performTasksRequireSettingsAction
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
export function settingsSelector(state: any): SettingsType {
  return state.settings.self;
}