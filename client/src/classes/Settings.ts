// Import classes
import { defaultDarkTheme } from "./ColorTheme";

// Import from classes

// Import from objects

// Import utils
import { LocalStorageUtils } from "src/utils/localstorage";
import { OtherUtils } from "src/utils/other";

let __privateInstance__: Settings | null = null;

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
 * __Singleton class__
 * 
 * Get singleton instance from this class and use to manage the
 * settings in app.
 * 
 * Because the settings need to be synced along the app. So this class
 * need to be used as singleton.
 */
export class Settings {
  isDarkMode!: boolean;
  sfx!: SFXSettingsType;
  lang!: LanguagesType;

  constructor() {
    if(__privateInstance__) return __privateInstance__;

    // Init some state of settings.
    this.init();
  }

  /**
   * Use this method to init some settings.
   */
  init() {
    let hasSoundWhenClickButton = LocalStorageUtils.getItem<boolean | undefined>("hasSoundWhenClickButton");
    let hasSoundWhenClickTable = LocalStorageUtils.getItem<boolean | undefined>("hasSoundWhenClickTable");

    // Init state
    this.isDarkMode = Boolean(LocalStorageUtils.getItem("isDarkMode"));
    this.sfx = {
      hasSoundWhenClickButton:
        hasSoundWhenClickButton === undefined ||  hasSoundWhenClickButton === null ? true : hasSoundWhenClickButton,
      hasSoundWhenClickTable:
        hasSoundWhenClickTable === undefined ||  hasSoundWhenClickTable === null ? true : hasSoundWhenClickTable
    };

    // Install theme to style#theme.
    defaultDarkTheme.install();

    // Theme
    this.setTheme(this.isDarkMode);
  }

  /**
   * Use this method to set status for `isDarkMode`.
   * @param isDark 
   */
  setTheme(isDark: boolean) {
    if(isDark) defaultDarkTheme.useTheme();
    else document.documentElement.setAttribute("data-theme", "default");
    LocalStorageUtils.setItem("isDarkMode", isDark);
  }

  /**
   * Use this method to set status for sfx setting.
   * @param soundSettingKey 
   * @param status 
   */
  setSFX(soundSettingKey: SFXSettingKeysType, status: boolean) {
    this.sfx[soundSettingKey] = status;
    LocalStorageUtils.setItem(soundSettingKey, this.sfx[soundSettingKey]);
  }

  /**
   * Use this method to switch between dark and light theme.
   */
  toggleTheme() {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      this, "isDarkMode",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("isDarkMode", status);
        if(status) {
          defaultDarkTheme.useTheme()
        } else {
          document.documentElement.setAttribute("data-theme", "default")
        }
      }
    );
  }

  /**
   * Use this method to toggle button click sound settings.
   */
  toggleButtonClickSound() {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      this.sfx, "hasSoundWhenClickButton",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("hasSoundWhenClickButton", status);
      }
    );
  }

  /**
   * Use this method to toggle table click sound settings.
   */
  toggleTableClickSound() {
    // Use togglePropertyState function in `OtherUtils` to toggle status.
    OtherUtils.togglePropertyState(
      this.sfx, "hasSoundWhenClickTable",
      function(status) {
        // Save to localstorage.
        LocalStorageUtils.setItem("hasSoundWhenClickTable", status);
      }
    );
  }
}

if(!__privateInstance__) __privateInstance__ = new Settings();

export const st = new Settings();