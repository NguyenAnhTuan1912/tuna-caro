import { CustomizedModalItemProps } from "tunangn-react-modal";
import { LangTextJSONType } from "src/types/lang.types";

export type GameDialogInputPropsType = {
  name: string;
  placeholder: string;
  type: string;
  replaceClassName: string;
}

export type GameDialogLayoutDataType = {
  title: (() => JSX.Element) | JSX.Element | string;
  notes: Array<string>;
  buttonLabel: string;
  inputs?: Array<GameDialogInputPropsType>;
  content?: (() => JSX.Element) | JSX.Element | string;
};

export type GameDialogLayoutProps = {
  data: GameDialogLayoutDataType;
  modalItemProps: CustomizedModalItemProps;
}

export type GameDialogDataType = {
  type: "game_finding_dialog" | "game_creating_dialog" | "game_joining_dialog",
  gameInfo?: GameInfoInGameJoiningDialog;
}

export type GameInfoInGameJoiningDialog = {
  gameName: string;
  host: string;
  hasPassword: boolean;
}

export type ContentOfGameJoiningDialogProps = {
  data: LangTextJSONType["gameJoiningDialog"]["content"];
  gameInfo: GameInfoInGameJoiningDialog;
};