import { LangTextJSONType } from "src/types/lang.types";

/**
 * Use this function to create empty lang text.
 * @returns 
 */
export function createEmptyLangText(): LangTextJSONType {
  return {
    "global": {
      "footTitle": "",
      "authorName": "",
      "noteLabel": "",
      "pauseGameText": "",
      "dataLoadingText": ""
    },

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
      "soundSettingsLabel": "",
      "playSoundWhenClickButtonSettingsLabel": "",
      "playSoundWhenClickTableSettingsLabel": "",
      "colorThemeSettingsLabel": "",
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

    "gameCreatingDialog": {
      "headerTitle": "",
      "notes": [],
      "closeBtnLabel": "",
      "inputPlaceHolders": {
        "gameName": "",
        "password": ""
      }
    },
  
    "gameFindingDialog": {
      "headerTitle": "",
      "notes": [],
      "closeBtnLabel": "",
      "inputPlaceHolders": {
        "gameName": "",
        "password": ""
      }
    },
  
    "gameJoiningDialog": {
      "headerTitle": "",
      "notes": {
        "hasPassword": [],
        "nonPassword": []
      },
      "closeBtnLabel": "",
      "inputPlaceHolders": {
        "password": ""
      },
      "content": {
        "subheading": "",
        "heading": "",
        "hostInfoLabel": "",
        "passwordInfoLabel": "",
        "passwordInfoValueLabels": []
      }
    },
  
    "sideMenu": {
      "guideLabel": "",
      "generalGuideLabel": "",
      "generalGuideText": "",
      "gameGuideLabel": "",
      "changeNameBtnLabel": "",
      "agreeChangeNameBtnLabel": "",
      "cancelChangeNameBtnLabel": "",
      "keyGuides": []
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
export function createLoadedLangStatus(langCodes: Array<string>, langTexts: any) {
  const obj: {[key: string]: boolean} = {};

  for(let langCode of langCodes) {
    if(langTexts[langCode]) obj[langCode] = true;
    else obj[langCode] = false;
  }

  return obj;
}