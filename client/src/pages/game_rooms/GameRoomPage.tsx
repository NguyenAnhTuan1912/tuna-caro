import React from 'react'
import { useNavigate } from 'react-router-dom';

// Import from classes
import { GameType, GameRoomType } from 'src/classes/Game';

// Import from api/soket
import { mySocket, Message, MySocket } from 'src/apis/socket';

// Import hooks
import { usePlayer } from 'src/hooks/usePlayer';
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import from components
import DataTable from 'src/components/data_table/DataTable';
import { openGameJoiningDialog } from 'src/components/dialog/GameDialog';

// Import types
import { GameRoomPageProps } from './GameRoomPage.props';

// Import styles
import './GameRoom.styles.css';

export default function GameRoomPage(props: GameRoomPageProps) {
  const limit = 5;

  const { player } = usePlayer();
  const [ gameRoomsState, gameRoomsStateFns ] = useStateWESSFns(
    {
      skip: 0,
      data: [] as Array<GameRoomType>
    },
    function(changeState) {
      return {
        /**
         * Use this function to add games to `data`.
         * @param games 
         */
        setGames: function(games: Array<GameRoomType>) {
          changeState("data", function(data) {
            data = games;
            return data;
          })
        },

        /**
         * Use this function to update skip to get next `skip` games.
         */
        nextGames: function() {
          changeState("skip", function(data) {
            
            return data;
          })
        }
      }
    }
  );

  const navigate = useNavigate();
  const { changeData } = useGlobalData();

  // Use to set up socket
  React.useEffect(() => {
    // Emit to get game.
    mySocket.emit(
      MySocket.createMessage(
        MySocket.EventNames.getGames,
        undefined,
        {
          limit,
          skip: gameRoomsState.skip
        }
      )
    );

    // Set up listener.
    let getGamesListener = mySocket.addEventListener(
      MySocket.EventNames.getGames,
      (m: Message<Array<GameRoomType>>) => {
        console.log("Message from `getGames`: ", m);
        gameRoomsStateFns.setGames(m.data!);
      }
    );

    /*
      Set up `join_game` listener for player who want to join.
      Receive a message from server contains data of player.
      Complete data of player.
    */
      let joinGameListener = mySocket.addEventListener(
        MySocket.EventNames.joinGame,
        (m: Message<GameType>) => {
          let game = m.data!;
          
          // Set new game.
          changeData("game", function() {
            return game;
          });
  
          // After set new game, navigato /game/online
          navigate("/game/online");
        }
      );

    // Unsubscribe events
    return function() {
      mySocket.removeEventListener(MySocket.EventNames.emitGame, joinGameListener);
      mySocket.removeEventListener(MySocket.EventNames.getGames, getGamesListener);
    }
  }, []);

  return (
    <div className="game-room-page p-2">
      <h1>Các phòng</h1>
      <DataTable
        data={gameRoomsState.data}
        renderHeader={() => (
          <tr>
            <td><strong>No</strong></td>
            <td><strong>Tên phòng</strong></td>
            <td><strong>Người chơi</strong></td>
            <td><strong>Mật khẩu</strong></td>
            <td><strong>Trạng thái</strong></td>
          </tr>
        )}
        renderRowData={(piece, index) => (
          <tr
            key={piece.id}
            onClick={(e) => {
              openGameJoiningDialog(
                piece.name,
                piece.playerName,
                piece.hasPassword
              )
              .then(result => {
                if(!result.isAgree) return;
                mySocket.emit(
                  MySocket.EventNames.joinGame,
                  MySocket.createMessage(
                    MySocket.EventNames.joinGame,
                    undefined,
                    {
                      player: player,
                      game: {
                        id: piece.id,
                        password: result.data.password
                      }
                    }
                  )
                );
              })
            }}
          >
            <td>{index + 1}</td>
            <td><strong>{piece.name}</strong></td>
            <td>{piece.playerName}</td>
            <td>{piece.hasPassword ? "Có" : "Không"}</td>
            <td>
              {
                piece.status === "Waiting"
                  ? <strong className="txt-clr-success">Đang chờ</strong>
                  : <strong className="txt-clr-error">Đang chơi</strong>
              }
            </td>
          </tr>
        )}
      />
    </div>
  )
}