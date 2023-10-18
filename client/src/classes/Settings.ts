// Import classes
import { defaultDarkTheme } from "./ColorTheme";

// Import objects
import { MyMap } from "src/objects/MyMap";

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

export type SoundSettingsType = "table_click" | "button_click";

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

    // Init state
    this.isDarkMode = false;

    // Install theme to style#theme.
    defaultDarkTheme.install();
  }

  /**
   * Use this method to switch between dark and light theme.
   */
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if(this.isDarkMode) {
      defaultDarkTheme.useTheme();
    } else {
      document.documentElement.setAttribute("data-theme", "default");
    }
  }
}

if(!__privateInstance__) __privateInstance__ = new Settings();

export const st = new Settings();