import { LangTextJSONType } from "src/types/lang.types";

/**
 * Use this function to create empty lang text.
 * @returns 
 */
export function createEmptyLangText(): LangTextJSONType {
  return {
    "homePage": {
      "headerTitle": "",
      "pageTitle": "",
      "twoPlayerBtnLabel": "",
      "createGameBtnLabel": "",
      "findGameBtnLabel": "",
      "exploreGamesBtnLabel": "",
      "settingsBtnLabel": ""
    },
  
    "settingsPage": {
      "headerTitle": "",
      "pageTitle": "",
      "systemSettingsLabel": "",
      "playSoundWhenClickButtonSettingsLabel": "",
      "playSoundWhenClickTableSettingsLabel": "",
      "darkThemeSettingsLabel": "",
      "languageSettingsLabel": "",
      "languageVieSelectLabel": "",
      "languageEngSelectLabel": "",
      "otherInformationsLabel": "",
      "aboutMeLabel": "",
      "aboutApplicationLabel": ""
    },
  
    "gameRoomsPage": {
      "headerTitle": "",
      "pageTitle": "",
      "tableHeaderRoomNameLabel": "",
      "tableHeaderHostLabel": "",
      "tableHeaderHasPasswordLabel": "",
      "tableHeaderStatusLabel": "",
      "tableRowHasPasswordLabel": [],
      "tableRowStatusLabel": []
    },
  
    "gamePages": {
      "pauseGameLayerLabel": "",
      "lostConnectionLabel": ""
    },
  
    "socketMessages": {
      "notExistRoom": "",
      "fullRoom": "",
      "wrongPassword": "",
      "createGameSuccessfully": "",
      "disconnected": "",
      "reconnected": "",
      "leaveGame": "",
      "reconnectGameSuccessfully": "",
      "handshake": "",
      "joinGame": ""
    }
  }
};

/**
 * Use this function to create loaded languages state.
 * @param langCodes 
 * @returns 
 */
export function createLoadedLangStatus(langCodes: Array<string>) {
  const obj: {[key: string]: boolean} = {};

  for(let langCode of langCodes) {
    obj[langCode] = false;
  }

  return obj;
}