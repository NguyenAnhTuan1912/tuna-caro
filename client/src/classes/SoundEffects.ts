// Import from classes
import { Settings } from "./Settings";

export type SFXPathsType = keyof typeof SoundEffects.SFXPaths;

let __privateInstance__: SoundEffects | null = null;

/**
 * Get singleton instance from this class to manage sound effects in app.
 * 
 * Use with `Settings` to get permission to perform some tasks.
 */
export class SoundEffects {
  static SoundsRoot = "/sounds";

  static SFXPaths = {
    hitTableSound: "/hit_table_sound.wav",
    buttonClickSound: "/button_click_sound.wav",
    notiSound: "/noti_sound.wav",
  };

  private _audio!: HTMLAudioElement;
  private _settings!: Settings;

  constructor() {
    if(__privateInstance__) return __privateInstance__;

    this._audio = new Audio();
    this._settings = new Settings();

    // Set default volume.
    this._audio.volume = .4;
  }
  
  /**
   * Use to play sound effect.
   * @param soundName 
  */
 async play(soundName: SFXPathsType) {
    let src = SoundEffects.SoundsRoot;

    // Reload
    this._audio.load();

    switch(soundName) {
      case "buttonClickSound": {
        // If this sfx is turn off, then return to prevent play this sound.
        if(!this._settings.sfx.hasSoundWhenClickButton) return;
        src += SoundEffects.SFXPaths.buttonClickSound;
        break;
      }

      case "hitTableSound": {
        // If this sfx is turn off, then return to prevent play this sound.
        if(!this._settings.sfx.hasSoundWhenClickTable) return;
        src += SoundEffects.SFXPaths.hitTableSound;
        break;
      }

      case "notiSound": {
        src += SoundEffects.SFXPaths.notiSound;
        break;
      }

      default: return;
    }

    // Load src.
    this._audio.src = src;

    // Play sound.
    await this._audio.play();
  }
}

if(!__privateInstance__) __privateInstance__ = new SoundEffects();

export const sfx = new SoundEffects();