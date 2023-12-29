import { CustomizedModalItemProps } from "tunangn-react-modal";

// Import hooks
import { useLangState } from "src/hooks/useLang";

// Import layouts
import GameDialogLayout from "src/layouts/game_dialog_layout/GameDialogLayout";

/**
 * Component renders a dialog allow players to create a game. Dialog contains 2 input fields:
 * game's name and game's password (optional).
 * @param props 
 * @returns 
 */
export default function GameCreatingDialog(props: CustomizedModalItemProps) {
  const { langTextJSON } = useLangState();

  return (
    <GameDialogLayout
      data={{
        title: <h3>{langTextJSON.gameCreatingDialog.headerTitle}</h3>,
        notes: langTextJSON.gameCreatingDialog.notes,
        buttonLabel: langTextJSON.gameCreatingDialog.closeBtnLabel,
        inputs: [
          { name: "game_name", placeholder: langTextJSON.gameCreatingDialog.inputPlaceHolders.gameName, replaceClassName: "spe-outline w-100 p-1 mb-1", type: "text" },
          { name: "password", placeholder: langTextJSON.gameCreatingDialog.inputPlaceHolders.password, replaceClassName: "spe-outline w-100 p-1", type: "password" }
        ]
      }}
      modalItemProps={props}
    />
  )
}