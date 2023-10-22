// Import classes
import { defaultDarkTheme, ColorTheme } from "./ColorTheme";

// Import from classes

// Import from objects

// Import utils
import { LocalStorageUtils } from "src/utils/localstorage";
import { OtherUtils } from "src/utils/other";

export type LanguagesType = "vie" | "us";

export interface SFXSettingsType {
  hasSoundWhenClickTable: boolean;
  hasSoundWhenClickButton: boolean;
}

export interface SettingsType {
  isDarkMode: boolean;
  sfx: SFXSettingsType;
  lang: LanguagesType;
}

export type SFXSettingKeysType = keyof SFXSettingsType;

/**
 * Use this class to create an settings object and manipulate the settings object's data.
 * Because of design of React and Redux, this class will has special design.
 */
export class Settings {
  // Lock constructor.
  private constructor() {}

  /**
   * Use this static method to create a settings object. Its content depend on
   * the data in localStorage.
   */
  static createSettings(): SettingsType {
    let hasSoundWhenClickButton = LocalStorageUtils.getItem<boolean | undefined>("hasSoundWhenClickButton");
    let hasSoundWhenClickTable = LocalStorageUtils.getItem<boolean | undefined>("hasSoundWhenClickTable");

    return {
      isDarkMode: Boolean(LocalStorageUtils.getItem("isDarkMode")),
      sfx: {
        hasSoundWhenClickButton:
          hasSoundWhenClickButton === undefined ||  hasSoundWhenClickButton === null ? true : hasSoundWhenClickButton,
        hasSoundWhenClickTable:
          hasSoundWhenClickTable === undefined ||  hasSoundWhenClickTable === null ? true : hasSoundWhenClickTable
      },
      lang: "vie"
    }
  }

  /**
   * Use this static method to create a default settings object.
   */
  static createDefault(): SettingsType {
    return {
      isDarkMode: false,
      sfx: {
        hasSoundWhenClickButton: true,
        hasSoundWhenClickTable: true
      },
      lang: "vie"
    }
  }

  /**
   * Use this method to set status for `isDarkMode`.
   * @param isDark 
   */
  static setTheme(isDark: boolean) {
    if(isDark) ColorTheme.enableTheme(defaultDarkTheme);
    else ColorTheme.unableTheme();
    LocalStorageUtils.setItem("isDarkMode", isDark);
  }

  /**
   * Use this method to set status for sfx setting.
   * @param soundSettingKey 
   * @param status 
   */
  static setSFX(st: SettingsType, soundSettingKey: SFXSettingKeysType, status: boolean) {
    st.sfx[soundSettingKey] = status;
    LocalStorageUtils.setItem(soundSettingKey, st.sfx[soundSettingKey]);
  }

  /**
   * Use this static method to switch between dark and light theme.
   * @param st 
   */
  static toggleTheme(st: SettingsType) {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      st, "isDarkMode",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("isDarkMode", status);
        if(status) {
          ColorTheme.enableTheme(defaultDarkTheme);
        } else {
          ColorTheme.unableTheme();
        }
      }
    );
  }

  /**
   * Use this static method to toggle button click sound settings.
   * @param st 
   */
  static toggleButtonClickSound(st: SettingsType) {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      st.sfx, "hasSoundWhenClickButton",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("hasSoundWhenClickButton", status);
      }
    );
  }

  /**
   * Use this method to toggle table click sound settings.
   * @param st 
   */
  static toggleTableClickSound(st: SettingsType) {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      st.sfx, "hasSoundWhenClickTable",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("hasSoundWhenClickTable", status);
      }
    );
  }
}