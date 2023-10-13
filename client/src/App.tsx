import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';

// Import from apis
import { mySocket } from 'src/apis/socket';

// Import from hooks
import { usePlayerActions } from './hooks/usePlayer';

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
  console.log("Render App");
  const playerDispatcher = usePlayerActions();

  React.useEffect(() => {
    async function init() {
      console.log("[App] Run init().");
      // Call API to get ID.
      playerDispatcher.getPlayerIDAsyncThunk();

      // Init
      mySocket.init((message) => {
        let data = message.data!;
        console.log("SocketID: ", data);
        playerDispatcher.setPlayerAction({
          socketId: data.socketId
        });
      });

      mySocket.handshake();
    };

    console.log("App ~ useEffect");
    init();

    return function() {
      console.log("Disconnect socket");
      mySocket.disconnect();
    }
  }, []);

  return (
    <>
      <Routes>
        {/* Home Page */}
        <Route
          path='/'
          element={
            <BaseLayout headerTitle={"Trang chủ"}>
              <HomePage />
            </BaseLayout>
          }
        />

        {/* Settings Page */}
        <Route
          path='/settings'
          element={
            <BaseLayout headerTitle={"Cài đặt"}>
              <SettingsPage />
            </BaseLayout>
          }
        />

        {/* GameRoomPage */}
        <Route
          path='/rooms'
          element={
            <BaseLayout headerTitle={"Phòng"}>
              <GameRoomPage />
            </BaseLayout>
          }
        />

        {/* Game Page */}
        <Route
          path='/game/:type'
          element={
            <BaseLayout headerTitle={"Game"} shownFooter={false} shownHeader={false}>
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
