import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';
import { useNavigate } from 'react-router-dom';

// Import from classes

// Import from apis
import { mySocket } from 'src/apis/socket';

// Import from hooks
import { useSettingsActions } from './hooks/useSettings';
import { usePlayerActions } from './hooks/usePlayer';

// Import from layout and pages
import BaseLayout from './layouts/base_layout/BaseLayout';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/SettingsPage';
import GameRoomPage from './pages/game_rooms/GameRoomPage';
import GamePage from './pages/game/components/GamePage';

// Import from components
import SideMenu, { name as SMName } from './components/side_menu/SideMenu';
import GameDialog, { name as GDName } from './components/dialog/GameDialog';
import CharacterPickerDialog, { name as CPDName } from './components/dialog/CharacterPickerDialog';
import SnackBar, { name as SBName } from './components/snack_bar/SnackBar';
import ConnectionStatusSnackBar, { name as CSSBName, openConnectionStatusSnackBar } from './components/snack_bar/ConnectionStatusSnackBar';

// Import from utils
import { ROUTES } from './utils/constant';

/**
 * This component in the center of the app. Contain many component that contains many components and so on...
 * @returns 
 */
function App() {
  const playerDispatcher = usePlayerActions();
  const settingsDispatcher = useSettingsActions();
  
  const navigate = useNavigate();

  // Handle some global Socket Exception
  React.useEffect(() => {
    const init = function() {
      let maxDisconnectionDuration = 0;
      let handleOfflineOnWindow: () => void;

      // Call API to get ID.
      playerDispatcher.getPlayerIDAsync();

      // Init
      mySocket.init((message) => {
        let data = message.data!;

        // Set socket id for player.
        playerDispatcher.setPlayer({
          socketId: data.socketId
        });

        // Set configured parameters
        maxDisconnectionDuration = data.configParams.maxDisconnectionDuration;
      });

      // Say hello to server
      mySocket.handshake();

      // Theme.
      settingsDispatcher.performTasksRequireSettings();

      handleOfflineOnWindow = function() {
        // If the disconnect is lost too long, navigate to home.
        let timeoutFunc = setTimeout(() => {
          // Navigate to Home Page.
          navigate(ROUTES.Home);
        }, maxDisconnectionDuration);

        openConnectionStatusSnackBar({ isConnected: false, timeoutFunc });
      };

      // Listen to `offline` event from `window`.
      window.addEventListener("offline", handleOfflineOnWindow);

      return function() {
        console.log("Disconnect socket");
        window.removeEventListener("offline", handleOfflineOnWindow);
        mySocket.disconnect();
      }
    };
    
    // Init socket.
    return init();
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
          [SMName]: {
            type: "side",
            placeOn: "right",
            element: SideMenu
          },
          [GDName]: {
            type: "dialog",
            element: GameDialog
          },
          [SBName]: {
            type: "snack-bar",
            position: "top",
            element: SnackBar
          },
          [CSSBName]: {
            type: "snack-bar",
            position: "top",
            duration: null,
            element: ConnectionStatusSnackBar
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
