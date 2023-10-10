import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';

// Import hoooks
import { usePlayerActions } from './hooks/usePlayer';
import { useSocket } from './hooks/useSocket';

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
  const playerDispatcher = usePlayerActions();
  const { socket } = useSocket();

  React.useEffect(() => {
    async function init() {
      // Call API to get ID.
      playerDispatcher.getPlayerIDAsyncThunk();

      // Handshake to socket on server
      socket.handshake();
    };

    init();

    return function() {
      socket.disconnect();
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
