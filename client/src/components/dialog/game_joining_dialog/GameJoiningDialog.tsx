import { CustomizedModalItemProps } from "tunangn-react-modal";

// Import hooks
import { useLangState } from "src/hooks/useLang";

// Import layouts
import GameDialogLayout from "src/layouts/game_dialog_layout/GameDialogLayout";

// Import types
import { GameDialogDataType, ContentOfGameJoiningDialogProps } from "src/types/dialog.types";

/**
 * Component renders content of GameJoiningDialog.
 * @param props 
 * @returns 
 */
function ContentOfGameJoiningDialog(props: ContentOfGameJoiningDialogProps) {
  return (
    <div className="mb-1">
      {props.data.subheading}
      <h3>{props.data.heading}: {props.gameInfo.gameName}</h3>
      <p>{props.data.hostInfoLabel}: {props.gameInfo.host}</p>
      <p>{props.data.passwordInfoLabel}: {props.gameInfo.hasPassword ? props.data.passwordInfoValueLabels[0] : props.data.passwordInfoValueLabels[1]}</p>
    </div>
  );
}

/**
 * Component renders a dialog that let players know before they join a game. Including some
 * information of game like name, host's name, password status and a password input field
 * (if that game has password).
 * @param props 
 * @returns 
 */
export default function GameJoiningDialog(props: CustomizedModalItemProps) {
  const { langTextJSON } = useLangState();

  const data = props.item.getData<GameDialogDataType>();
  const gameInfo = data.gameInfo!;

  return (
    <GameDialogLayout
      data={{
        title: <h3>{langTextJSON.gameJoiningDialog.headerTitle}</h3>,
        notes: gameInfo.hasPassword ? langTextJSON.gameJoiningDialog.notes.hasPassword : langTextJSON.gameJoiningDialog.notes.nonPassword,
        buttonLabel: langTextJSON.gameJoiningDialog.closeBtnLabel,
        inputs: gameInfo.hasPassword ? [
          { name: "password", placeholder: langTextJSON.gameJoiningDialog.inputPlaceHolders.password, replaceClassName: "spe-outline w-100 p-1", type: "password" }
        ] : undefined,
        content: (
          <ContentOfGameJoiningDialog
            gameInfo={gameInfo}
            data={{
              subheading: langTextJSON.gameJoiningDialog.content.subheading,
              heading: langTextJSON.gameJoiningDialog.content.heading,
              hostInfoLabel: langTextJSON.gameJoiningDialog.content.hostInfoLabel,
              passwordInfoLabel: langTextJSON.gameJoiningDialog.content.passwordInfoLabel,
              passwordInfoValueLabels: langTextJSON.gameJoiningDialog.content.passwordInfoValueLabels
            }}
          />
        )
      }}
      modalItemProps={props}
    />
  )
}