import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import classes
import { GameType } from 'src/classes/Game';

// Import from api/soket
import { mySocket, Message, MySocket } from 'src/apis/socket';

// Import hooks
import { useGlobalData } from 'src/hooks/useGlobalData';
import { usePlayer } from 'src/hooks/usePlayer';

// Import from components
import { openGameFindingDialog, openGameCreatingDialog } from 'src/components/dialog/GameDialog';
import { openNotifiableSnackBar } from 'src/components/snack_bar/SnackBar';
import Button from 'src/components/button/Button';

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  const { player } = usePlayer();
  
  const navigate = useNavigate();
  const { changeData } = useGlobalData();

  React.useEffect(() => {
    /*
      Set up listener for emit_game.
      Receive a message from server that contains a data of game. Including:
      - id (this is so fucking important)
      - name
      - password
    */
    let emitGameListener = mySocket.addEventListener(
      MySocket.EventNames.emitGame,
      (m: Message<GameType>) => {
        if(m.isError) return;
        let game = m.data!;

        // Set new game.
        changeData("game", function() {
          return game;
        });

        // After change the data, navigate to /game/online
        navigate("/game/online");
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

    openNotifiableSnackBar("Chào mừng bạn tới Caro game")
    .then(result => {
      console.log("Snackbar result: ", result);
    })

    return function() {
      mySocket.removeEventListener(MySocket.EventNames.emitGame, emitGameListener);
      mySocket.removeEventListener(MySocket.EventNames.joinGame, joinGameListener);
    }
  }, []);

  return (
    <div className="home-page p-2">
      <h1 className="txt-center">Trang chủ</h1>
      <div className="home-page-menu w-100 pt-4">
        <Button to={"/game/offline"} extendClassName="w-100">Chơi 2 người</Button>

        <hr className="my-4"></hr>
        
        <Button
          extendClassName="w-100 mb-1"
          onClick={() => {
            openGameCreatingDialog().then(result => {
              if(!result.isAgree) return;
              mySocket.emit(
                MySocket.EventNames.emitGame,
                MySocket.createMessage(
                  MySocket.EventNames.emitGame,
                  undefined,
                  {
                    player: player,
                    game: {
                      name: result.data.game_name,
                      password: result.data.password
                    }
                  }
                )
              );
            })
          }}
        >
          <strong className="txt-clr-primary">Tạo phòng chơi trực tuyến</strong>
        </Button>

        <Button
          onClick={() => {
            openGameFindingDialog().then(result => {
              if(!result.isAgree) return;
              mySocket.emit(
                MySocket.EventNames.joinGame,
                MySocket.createMessage(
                  MySocket.EventNames.joinGame,
                  undefined,
                  {
                    player: player,
                    game: {
                      id: result.data.game_id,
                      password: result.data.password
                    }
                  }
                )
              );
            })
          }}
          extendClassName="w-100 mb-1"
        >
          Tìm phòng
        </Button>

        <Button to={"/rooms"} extendClassName="w-100">Khám phá</Button>

        <hr className="my-4"></hr>

        <Button to={"/settings"} extendClassName="w-100">Cài đặt</Button>
      </div>
    </div>
  )
}