import { CustomizedModalItemProps } from "tunangn-react-modal";

// Import hooks
import { useLangState } from "src/hooks/useLang";

// Import layouts
import GameDialogLayout from "src/layouts/game_dialog_layout/GameDialogLayout";

/**
 * Component renders a dialog that allow players enter the information of game to join in.
 * The information contains game's id and game's password (if any).
 * @param props 
 * @returns 
 */
export default function GameFindingDialog(props: CustomizedModalItemProps) {
  const { langTextJSON } = useLangState();

  return (
    <GameDialogLayout
      data={{
        title: <h3>{langTextJSON.gameFindingDialog.headerTitle}</h3>,
        notes: langTextJSON.gameFindingDialog.notes,
        buttonLabel: langTextJSON.gameFindingDialog.closeBtnLabel,
        inputs: [
          { name: "game_id", placeholder: langTextJSON.gameFindingDialog.inputPlaceHolders.gameName, replaceClassName: "spe-outline w-100 p-1 mb-1", type: "text" },
          { name: "password", placeholder: langTextJSON.gameFindingDialog.inputPlaceHolders.password, replaceClassName: "spe-outline w-100 p-1", type: "password" }
        ]
      }}
      modalItemProps={props}
    />
  )
}