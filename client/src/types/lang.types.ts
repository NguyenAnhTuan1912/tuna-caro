export type LangTextJSONType = {
  "global": {
    "footTitle": string,
    "authorName": string,
    "noteLabel": string,
    "pauseGameText": "string"
  },

  "homePage": {
    "headerTitle": string,
    "pageTitle": string,
    "twoPlayerBtnLabel": string,
    "createGameBtnLabel": string,
    "findGameBtnLabel": string,
    "exploreGamesBtnLabel": string,
    "settingsBtnLabel": string
  },

  "settingsPage": {
    "headerTitle": string,
    "pageTitle": string,
    "systemSettingsLabel": string,
    "soundSettingsLabel": string,
    "playSoundWhenClickButtonSettingsLabel": string,
    "playSoundWhenClickTableSettingsLabel": string,
    "colorThemeSettingsLabel": string,
    "darkThemeSettingsLabel": string,
    "languageSettingsLabel": string,
    "languageVieSelectLabel": string,
    "languageEngSelectLabel": string,
    "otherInformationsLabel": string,
    "aboutMeLabel": string,
    "aboutApplicationLabel": string
  },

  "gameRoomsPage": {
    "headerTitle": string,
    "pageTitle": string,
    "tableHeaderRoomNameLabel": string,
    "tableHeaderHostLabel": string,
    "tableHeaderHasPasswordLabel": string,
    "tableHeaderStatusLabel": string,
    "tableRowHasPasswordLabel": Array<string>,
    "tableRowStatusLabel": Array<string>
  },

  "gamePages": {
    "pauseGameLayerLabel": string,
    "lostConnectionLabel": string
  },

  "gameCreatingDialog": {
    "headerTitle": string,
    "notes": Array<string>,
    "closeBtnLabel": string,
    "inputPlaceHolders": {
      "gameName": string,
      "password": string
    }
  },

  "gameFindingDialog": {
    "headerTitle": string,
    "notes": Array<string>,
    "closeBtnLabel": string,
    "inputPlaceHolders": {
      "gameName": string,
      "password": string
    }
  },

  "gameJoiningDialog": {
    "headerTitle": string,
    "notes": {
      "hasPassword": Array<string>,
      "nonPassword": Array<string>
    },
    "closeBtnLabel": string,
    "inputPlaceHolders": {
      "password": string
    },
    "content": {
      "subheading": string,
      "heading": string,
      "hostInfoLabel": string,
      "passwordInfoLabel": string,
      "passwordInfoValueLabels": Array<string>
    }
  },

  "sideMenu": {
    "guideLabel": string,
    "generalGuideLabel": string,
    "generalGuideText": string,
    "gameGuideLabel": string,
    "changeNameBtnLabel": string,
    "agreeChangeNameBtnLabel": string,
    "cancelChangeNameBtnLabel": string,
    "keyGuides": Array<{ "text": string; "textKey"?: string; "googleIconKey"?: string }>;
  },

  "socketMessages": {
    "notExistRoom": string,
    "fullRoom": string,
    "wrongPassword": string,
    "createGameSuccessfully": string,
    "disconnected": string,
    "reconnected": string,
    "leaveGame": string,
    "reconnectGameSuccessfully": string,
    "handshake": string,
    "joinGame": string
  }
};