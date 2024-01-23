// Import from classes
import { GameRoomType } from 'src/classes/Game';
import { PlayerType } from 'src/classes/Player';

// Import from api/soket
import { mySocket, MySocket } from 'src/apis/socket';

// Import hooks
import { useLangState } from 'src/hooks/useLang';

// Import from components
import { openGameJoiningDialog } from 'src/components/dialog/GameDialog';

type GameRowProps = {
  data: GameRoomType;
  index: number;
  player: PlayerType
};

export default function GameRow(props: GameRowProps) {
  const { langTextJSON } = useLangState();

  const canJoin = props.data.status === "Waiting" ? true : false;

  return (
    <tr
      key={props.data.id}
      onClick={() => {
        if(canJoin)
          openGameJoiningDialog(
            props.data.name,
            props.data.playerName,
            props.data.hasPassword
          )
          .then(result => {
            if(!result.isAgree) return;
            mySocket.emit(
              MySocket.EventNames.joinGame,
              MySocket.createMessage(
                MySocket.EventNames.joinGame,
                undefined,
                {
                  player: props.player,
                  game: {
                    id: props.data.id,
                    password: result.data.password
                  }
                }
              )
            );
          })
      }}
    >
      <td>{props.index + 1}</td>
      <td><strong>{props.data.name}</strong></td>
      <td>{props.data.playerName}</td>
      <td>{props.data.hasPassword ? langTextJSON.gameRoomsPage.tableRowHasPasswordLabel[0] : langTextJSON.gameRoomsPage.tableRowHasPasswordLabel[1]}</td>
      <td>
        {
          canJoin
            ? <strong className="txt-clr-success">{langTextJSON.gameRoomsPage.tableRowStatusLabel[0]}</strong>
            : <strong className="txt-clr-error">{langTextJSON.gameRoomsPage.tableRowStatusLabel[1]}</strong>
        }
      </td>
    </tr>
  )
}