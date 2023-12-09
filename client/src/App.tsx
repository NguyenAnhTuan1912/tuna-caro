import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';

// Import from classes

// Import from apis
import { mySocket } from 'src/apis/socket';

// Import from hooks
import { useSettingsActions } from './hooks/useSettings';
import { usePlayerActions } from './hooks/usePlayer';

// Import layout and pages
import BaseLayout from './layouts/base_layout/BaseLayout';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/SettingsPage';
import GameRoomPage from './pages/game_rooms/GameRoomPage';
import GamePage from './pages/game/GamePage';

// Import components
import SideMenu from './components/side_menu/SideMenu';
import GameDialog, { name as GDName } from './components/dialog/GameDialog';
import CharacterPickerDialog, { name as CPDName } from './components/dialog/CharacterPickerDialog';
import SnackBar from './components/snack_bar/SnackBar';

/**
 * This component in the center of the app. Contain many component that contains many components and so on...
 * @returns 
 */
function App() {
  const playerDispatcher = usePlayerActions();
  const settingsDispatcher = useSettingsActions();

  // Handle some global Socket Exception
  React.useEffect(() => {
    async function init() {
      // Call API to get ID.
      playerDispatcher.getPlayerIDAsync();

      // Init
      mySocket.init((message) => {
        let data = message.data!;
        playerDispatcher.setPlayer({
          socketId: data.socketId
        });
      });

      // Say hello to server
      mySocket.handshake();
    };

    // Init socket.
    init();

    // Theme.
    settingsDispatcher.performTasksRequireSettings();

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
          [GDName]: {
            type: "dialog",
            element: GameDialog
          },
          mySnackBar: {
            type: "snack-bar",
            position: "top-right",
            element: SnackBar
          },
          [CPDName]: {
            type: "dialog",
            element: CharacterPickerDialog
          }
        }}
      />
    </>
  );
}

export default App;
