import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';

// Import APIs
import { OtherAPIs } from './apis/others';

// Import socket
import { MySocket, socket, Message } from './apis/socket';

// Import hoooks
import { useStateWESSFns } from './hooks/useStateWESSFns';

// Import layout and pages
import BaseLayout from './layouts/base_layout/BaseLayout';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/SettingsPage';
import GameRoomPage from './pages/game_rooms/GameRoomPage';
import GamePage from './pages/game/GamePage';

// Import components
import SideMenu from './components/side_menu/SideMenu';
import GameCreatingDialog from './components/dialog/GameCreatingDialog';
import GameFindingDialog from './components/dialog/GameFindingDialog';

function App() {
  React.useEffect(() => {
    async function init() {
      // Call API to get ID.
      // const responseData = await OtherAPIs.getRandomID();
      // console.log("ID: ", responseData.data);

      // Handshake to socket on server
      // socket.handshake();

      // Emit game for testing
      // socket.emit(MySocket.EventNames.emitGame);

      // Add event for testing
      // socket.addEventListener(MySocket.EventNames.emitGame, function(message: Message<any>) {
      //   console.log(message);
      // });
    };

    init();
  }, []);

  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route
          path='/'
          element={
            <BaseLayout headerTitle={"Home"}>
              <HomePage />
            </BaseLayout>
          }
        />

        {/* Settings Page */}
        <Route
          path='/settings'
          element={
            <BaseLayout headerTitle={"Settings"}>
              <SettingsPage />
            </BaseLayout>
          }
        />

        {/* GameRoomPage */}
        <Route
          path='/rooms'
          element={
            <BaseLayout headerTitle={"Rooms"}>
              <GameRoomPage />
            </BaseLayout>
          }
        />

        {/* Game Page */}
        <Route
          path='/game'
          element={
            <BaseLayout headerTitle={"Game"} shownFooter={false}>
              <GamePage />
            </BaseLayout>
          }
        />
      </Routes>

      {/* Modal */}
      <TunangnModal
        items={{
          mySideMenu: {
            type: "side",
            placeOn: "right",
            element: SideMenu
          },
          myGameFindingDialog: {
            type: "dialog",
            element: GameFindingDialog
          },
          myGameCreatingDialog: {
            type: "dialog",
            element: GameCreatingDialog
          }
        }}
      />
    </>
  );
}

export default App;
