import { CustomizedModalItemProps, openTMI } from 'tunangn-react-modal';

// Import other dialogs
import GameCreatingDialog from './game_creating_dialog/GameCreatingDialog';
import GameFindingDialog from './game_finding_dialog/GameFindingDialog';
import GameJoiningDialog from './game_joining_dialog/GameJoiningDialog';

// Import types
import {
  GameDialogDataType
} from '../../types/dialog.types';

export const name = "myGameDialog";

/**
 * Use this function to open a dialog when you want to get data for game finding.
 */
export function openGameFindingDialog() {
  return openTMI(
    name,
    {
      type: "game_finding_dialog"
    }
  );
}

/**
 * Use this function to open a dialog when you want to get data for game creating.
 */
export function openGameCreatingDialog() {
  return openTMI(
    name,
    {
      type: "game_creating_dialog"
    }
  );
}

/**
 * Use this function to open a dialog when you want to get data for game joining.
 * @param gameName 
 * @param host 
 * @param hasPassword 
 * @returns 
 */
export function openGameJoiningDialog(gameName: string, host: string, hasPassword: boolean) {
  return openTMI(
    name,
    {
      type: "game_joining_dialog",
      gameInfo: {
        gameName,
        host,
        hasPassword
      }
    }
  );
}

/**
 * A component will pop a dialog up. There are a form has ID and Password (optional).
 * Users use this to find a quick game.
 * @param props 
 * @returns 
 */
export default function GameDialog(props: CustomizedModalItemProps) {
  const data = props.item.getData<GameDialogDataType>();

  switch(data.type) {
    case "game_creating_dialog":
      return <GameCreatingDialog {...props} />
    case "game_finding_dialog":
      return <GameFindingDialog {...props} />
    case "game_joining_dialog":
      return <GameJoiningDialog {...props} />
  }
}