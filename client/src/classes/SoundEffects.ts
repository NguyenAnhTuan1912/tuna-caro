// Import from classes
import { SettingsType } from "./Settings";

// Import from objects
import { MyMap } from "src/objects/MyMap";

export type SFXPathsType = keyof typeof SoundEffects.SFXPaths;

export interface SoundEffectsType {
  audios: MyMap<SFXPathsType, HTMLAudioElement>;
  settings: SettingsType;
}

let __AudioList__: MyMap<SFXPathsType, HTMLAudioElement> | null = null;

/**
 * Use this static class to create SoundEffects object.
 */
export class SoundEffects {
  static SoundsRoot = "/sounds";

  static SFXPaths = {
    hitTableSound: "/hit_table_sound.wav",
    buttonClickSound: "/button_click_sound.wav",
    notiSound: "/noti_sound.wav",
  };

  // Lock constructor.
  private constructor() {}

  /**
   * Use this static method to create SoundEffects.
   * @param st 
   * @returns 
   */
  static createSoundEffects(st: SettingsType): SoundEffectsType {
    let audios: MyMap<SFXPathsType, HTMLAudioElement>;
    if(__AudioList__) audios = __AudioList__;
    else {
      let keys = Object.keys(SoundEffects.SFXPaths);
      __AudioList__ = new MyMap();

      for(let key of keys) {
        let src = SoundEffects.SoundsRoot + SoundEffects.SFXPaths[key as SFXPathsType];
        let audio = new Audio(src);

        // Set volume
        audio.volume = .4;

        __AudioList__.set(key as SFXPathsType, audio);
      }

      audios = __AudioList__;
    }



    return {
      audios,
      settings: st
    }
  }

  /**
   * Use this private static method to reset audio.
   * @param audio 
   */
  private static _resetAudio(audio: HTMLAudioElement) {
    // Pause
    audio.pause();

    // Set to 0
    audio.currentTime = 0;
  } 
  
  /**
   * Use this static async method to play sound effect.
   * @param soundName 
  */
 static async play(sfx: SoundEffectsType, soundName: SFXPathsType) {
    let audio: HTMLAudioElement;

    switch(soundName) {
      case "buttonClickSound": {
        // If this sfx is turn off, then return to prevent play this sound.
        if(!sfx.settings.sfx.hasSoundWhenClickButton) return;

        audio = sfx.audios.get("buttonClickSound")!;
        break;
      }

      case "hitTableSound": {
        // If this sfx is turn off, then return to prevent play this sound.
        if(!sfx.settings.sfx.hasSoundWhenClickTable) return;

        audio = sfx.audios.get("hitTableSound")!;
        break;
      }

      case "notiSound": {
        audio = sfx.audios.get("notiSound")!;
        break;
      }

      default: return;
    }

    // Reset audio
    SoundEffects._resetAudio(audio);

    // Play
    await audio.play();
  }
}