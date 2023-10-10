import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { openTMI } from 'tunangn-react-modal';

// Import classes
import { GameType } from 'src/classes/Game';
import { Message } from 'src/apis/socket';

// Import hooks
import { useSocket } from 'src/hooks/useSocket';
import { useGlobalData } from 'src/hooks/useGlobalData';

// Import component

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  const navigate = useNavigate();
  const { socket, EventNames } = useSocket();
  const { changeData } = useGlobalData();

  React.useEffect(() => {
    const listener = socket.addEventListener(EventNames.emitGame, (m: Message<GameType>) => {
      if(m.isError) return;
      let data = m.data!;
      changeData("game", function(game) {
        if(!game) return game;
        game.id = data.id;
        game.name = data.name;
        game.password = data.password;
        return game;
      });
      navigate("/game/online");
    });

    return function() {
      socket.removeEventListener(EventNames.emitGame, listener);
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

              socket.emit(EventNames.emitGame, {
                isError: false,
                eventName: EventNames.emitGame,
                data: {
                  name: result.data.name,
                  password: result.data.password
                }
              });
            })
          }}
          className="btn spe-outline w-100 mb-1"
        ><strong className="txt-clr-primary">Tạo phòng chơi trực tuyến</strong></button>

        <button
          onClick={() => {
            openTMI("myGameFindingDialog")
          }}
          className="btn spe-outline w-100 mb-1"
        >Tìm người chơi</button>

        <Link to={"/rooms"}><button className="btn spe-outline w-100">Khám phá</button></Link>

        <hr className="my-4"></hr>

        <Link to={"/settings"}><button className="btn spe-outline w-100">Cài đặt</button></Link>
      </div>
    </div>
  )
}