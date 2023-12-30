// Import classes
import { defaultDarkTheme, ColorTheme } from "./ColorTheme";

// Import from classes

// Import from objects

// Import from utils
import { LANG_CODES } from "src/utils/constant";
import { BrowserStorageUtils, LocalStorageKeys } from "src/utils/browser_storage";
import { OtherUtils } from "src/utils/other";

// Import types
import { LangCode } from "src/state/lang";

export interface SFXSettingsType {
  hasSoundWhenClickTable: boolean;
  hasSoundWhenClickButton: boolean;
}

export interface SettingsType {
  isDarkMode: boolean;
  sfx: SFXSettingsType;
  lang: LangCode;
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
    let storedSettings = BrowserStorageUtils.getItem<SettingsType>(LocalStorageKeys.settings);
    let hasSoundWhenClickButton = storedSettings?.sfx?.hasSoundWhenClickButton;
    let hasSoundWhenClickTable = storedSettings?.sfx?.hasSoundWhenClickTable;

    return {
      isDarkMode: Boolean(storedSettings?.isDarkMode),
      sfx: {
        hasSoundWhenClickButton:
          hasSoundWhenClickButton === undefined ||  hasSoundWhenClickButton === null ? true : hasSoundWhenClickButton,
        hasSoundWhenClickTable:
          hasSoundWhenClickTable === undefined ||  hasSoundWhenClickTable === null ? true : hasSoundWhenClickTable
      },
      lang: storedSettings?.lang ? storedSettings?.lang : LANG_CODES[0]
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
      lang: LANG_CODES[0]
    }
  }

  /**
   * Use this method to set status for `isDarkMode`.
   * @param isDark 
   */
  static setTheme(isDark: boolean) {
    if(isDark) ColorTheme.enableTheme(defaultDarkTheme);
    else ColorTheme.unableTheme();
    BrowserStorageUtils.setItem("isDarkMode", isDark);
  }

  /**
   * Use this method to set status for sfx setting.
   * @param soundSettingKey 
   * @param status 
   */
  static setSFX(st: SettingsType, soundSettingKey: SFXSettingKeysType, status: boolean) {
    st.sfx[soundSettingKey] = status;
    BrowserStorageUtils.updateItem<SettingsType>(LocalStorageKeys.settings, { sfx: st.sfx });
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
        BrowserStorageUtils
        .updateItem<SettingsType>(LocalStorageKeys.settings, {
          isDarkMode: status
        });
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
        BrowserStorageUtils
        .updateItem<SettingsType>(LocalStorageKeys.settings, {
          sfx: {
            hasSoundWhenClickButton: status,
            hasSoundWhenClickTable: st.sfx.hasSoundWhenClickTable
          }
        });
      }
    );
  }

  /**
   * Use this static method to toggle table click sound settings.
   * @param st 
   */
  static toggleTableClickSound(st: SettingsType) {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      st.sfx, "hasSoundWhenClickTable",
      function(status) {
        // Save to localstorage.
        BrowserStorageUtils
        .updateItem<SettingsType>(LocalStorageKeys.settings, {
          sfx: {
            hasSoundWhenClickButton: st.sfx.hasSoundWhenClickButton,
            hasSoundWhenClickTable: status
          }
        });
      }
    );
  }

  /**
   * Use this static method to update lang in settings.
   * @param st 
   * @param langCode 
   */
  static updateLang(st: SettingsType, langCode: string) {
    st.lang = langCode;
    BrowserStorageUtils
    .updateItem<SettingsType>(LocalStorageKeys.settings, {
      lang: langCode
    });
  }
}