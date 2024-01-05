import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import classes

// Import from api/soket
import { mySocket, MySocket } from 'src/apis/socket';

// Import from ws_event_listeners
import { WSEventListeners } from 'src/ws_event_listeners';

// Import from hooks
import { useLangState } from 'src/hooks/useLang';
import { useGlobalData } from 'src/hooks/useGlobalData';
import { usePlayer } from 'src/hooks/usePlayer';

// Import from utils
import { ROUTES } from 'src/utils/constant';

// Import from layouts
import BaseLayout from 'src/layouts/base_layout/BaseLayout';

// Import from components
import { openGameFindingDialog, openGameCreatingDialog } from 'src/components/dialog/GameDialog';
import Button from 'src/components/button/Button';

// Locally Import
import { HomePageSocketEvents } from './socket_events/home_page';

// Import types
import { HomePageProps } from './HomePage.props';

// Import styles
import "./HomePage.styles.css";

export default function HomePage(props: HomePageProps) {
  const { player } = usePlayer();
  const { langTextJSON, langAboutJSON } = useLangState();
  
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
      HomePageSocketEvents.getEmitGameListener({
        changeData,
        navigate,
        langText: langTextJSON
      })
    );

    /*
      Set up `join_game` listener for player who want to join.
      Receive a message from server contains data of player.
      Complete data of player.
    */
    let joinGameListener = mySocket.addEventListener(
      MySocket.EventNames.joinGame,
      WSEventListeners.getJoinGameListener({
        changeData,
        navigate,
        langText: langTextJSON
      })
    );

    return function() {
      mySocket.removeEventListener(MySocket.EventNames.emitGame, emitGameListener);
      mySocket.removeEventListener(MySocket.EventNames.joinGame, joinGameListener);
    }
  }, []);

  return (
    <BaseLayout
      headerOptions={{
        title: langTextJSON.homePage.headerTitle
      }}
    >
      <div className="home page p-2">
        <h1 className="txt-center">{langTextJSON.homePage.pageTitle}</h1>
        <div className="home-menu w-100 pt-4">
          <Button to={ROUTES.GameOffline} extendClassName="w-100">{langTextJSON.homePage.twoPlayerBtnLabel}</Button>

          <hr className="my-4"></hr>
          
          <Button
            extendClassName="w-100 mb-1 txt-clr-primary fw-bold"
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
            {langTextJSON.homePage.createGameBtnLabel}
          </Button>

          <Button
            extendClassName="w-100 mb-1"
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
          >
            {langTextJSON.homePage.findGameBtnLabel}
          </Button>

          <Button to={ROUTES.GameRooms} extendClassName="w-100">{langTextJSON.homePage.exploreGamesBtnLabel}</Button>

          <hr className="my-4"></hr>

          <Button to={ROUTES.Settings} extendClassName="w-100">{langTextJSON.homePage.settingsBtnLabel}</Button>
        </div>
      </div>
    </BaseLayout>
  )
}