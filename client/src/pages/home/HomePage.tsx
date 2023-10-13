import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openTMI } from 'tunangn-react-modal';

// Import classes
import { GameType } from 'src/classes/Game';

// Import from api/soket
import { mySocket, Message, MySocket } from 'src/apis/socket';

// Import hooks
import { useGlobalData } from 'src/hooks/useGlobalData';
import { usePlayer } from 'src/hooks/usePlayer';

// Import component

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  console.log("Render Home");
  const navigate = useNavigate();
  const { player } = usePlayer();
  const { changeData } = useGlobalData();

  React.useEffect(() => {
    let emitGameListener = mySocket.addEventListener(
      MySocket.EventNames.emitGame,
      (m: Message<GameType>) => {
        if(m.isError) return;
        let data = m.data!;
        
        console.log("Event: ", m);

        changeData("game", function() {
          return data;
        });

        navigate("/game/online");
      }
    );

    // Set up `join_game` listener for player who want to join.
    let joinGameListener = mySocket.addEventListener(
      MySocket.EventNames.joinGame,
      (m: Message<GameType>) => {
        let game = m.data!;
        console.log("[HomePage] Message: ", m);
        
        changeData("game", function() {
          return game;
        });

        navigate("/game/online");
      }
    );

    return function() {
      console.log("Unsubscribe EMIT_GAME");
      mySocket.removeEventListener(MySocket.EventNames.emitGame, emitGameListener);
      mySocket.removeEventListener(MySocket.EventNames.joinGame, joinGameListener);
    }
  }, []);

  return (
    <div className="home-page p-2">
      <h1 className="txt-center">Trang chủ</h1>
      <div className="home-page-menu w-100 pt-4">
        <Link to={"/game/offline"}><button className="btn spe-outline w-100">Chơi 2 người</button></Link>

        <hr className="my-4"></hr>

        <button
          onClick={() => {
            openTMI("myGameCreatingDialog").then(result => {
              if(!result.isAgree) return;
              mySocket.emit(
                MySocket.EventNames.emitGame,
                MySocket.createMessage(
                  MySocket.EventNames.emitGame,
                  undefined,
                  {
                    player: player,
                    game: {
                      name: result.data.name,
                      password: result.data.password
                    }
                  }
                )
              );
            })
          }}
          className="btn spe-outline w-100 mb-1"
        ><strong className="txt-clr-primary">Tạo phòng chơi trực tuyến</strong></button>

        <button
          onClick={() => {
            openTMI("myGameFindingDialog").then(result => {
              if(!result.isAgree) return;
              console.log("GameFinding result: ", result);
              mySocket.emit(
                MySocket.EventNames.joinGame,
                MySocket.createMessage(
                  MySocket.EventNames.joinGame,
                  undefined,
                  {
                    player: player,
                    game: {
                      id: result.data.id,
                      password: result.data.password
                    }
                  }
                )
              );
            })
          }}
          className="btn spe-outline w-100 mb-1"
        >Tìm phòng</button>

        <Link to={"/rooms"}><button className="btn spe-outline w-100">Khám phá</button></Link>

        <hr className="my-4"></hr>

        <Link to={"/settings"}><button className="btn spe-outline w-100">Cài đặt</button></Link>
      </div>
    </div>
  )
}