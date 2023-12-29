import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { TunangnModal } from 'tunangn-react-modal';

// Import from classes

// Import from apis
import { mySocket } from 'src/apis/socket';

// Import from hooks
import { useSettings } from './hooks/useSettings';
import { usePlayerActions } from './hooks/usePlayer';
import { useGlobalData } from './hooks/useGlobalData';
import { useLang, getLangTextJSON } from './hooks/useLang';

// Import from layout and pages
import BaseLayout from './layouts/base_layout/BaseLayout';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/SettingsPage';
import GameRoomPage from './pages/game_rooms/GameRoomPage';
import GamePage from './pages/game/GamePage';

// Import from components
import LoadingIndicator from './components/loading_indicator/LoadingIndicator';
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
  const { settings, settingsDispatcher } = useSettings();
  const { lang, langDispatcher } = useLang();

  const langTextJSON = getLangTextJSON(lang.text, lang.currentLang);

  const gpd = useGlobalData();

  // Handle some global Socket Exception
  React.useEffect(() => {
    const init = function() {
      let handleOfflineOnWindow = function() {
        openConnectionStatusSnackBar({ isConnected: false });
      };

      // Call API to get ID.
      playerDispatcher.getPlayerIDAsync();

      // Init
      mySocket.init((data) => {
        // Set configured parameters
        if(data.configParams !== undefined)
          gpd.changeData("maxDisconnectionDuration", function() {
            return data.configParams!.maxDisconnectionDuration;
          });
      });

      // Listen to `connect` event.
      mySocket.connect(function(socket) {
        let socketId = socket.id;

        if(socket.recovered) {
          // Old connection is recovered.
        } else {
          // New connection is established.
          /*
            Whenever a new connection is established, this playerDispatcher will dispatch
            a payload to Redux Store to update socketId of player.
            There are 2 cases a new connection is established:
              - Player enter the app at first.
              - The reconnection times of socket instance (client) is over 5 times. Then
              the new connection will be established.
          */
          playerDispatcher.setPlayer({
            socketId
          });
        }
      });

      // Say hello to server
      mySocket.handshake();

      // Theme.
      settingsDispatcher.performTasksRequireSettings();

      // Listen to `offline` event from `window`.
      window.addEventListener("offline", handleOfflineOnWindow);

      // Fetch text data
      langDispatcher.getLanguagesAsync(settings.lang);

      return function() {
        console.log("Disconnect socket");
        window.removeEventListener("offline", handleOfflineOnWindow);
        mySocket.disconnect();
      }
    };
    
    // Init socket.
    return init();
  }, []);

  if(!lang.loaded[lang.currentLang]) {
    return (
      <div className="container flex-box ait-center jc-center">
        <LoadingIndicator
          text="Đang tải dữ liệu..."
        />
      </div>
    );
  };

  return (
    <>
      <Routes>
        {/* Redirect */}
        <Route path={ROUTES.Game} element={<Navigate to={ROUTES.GameOffline} />} />

        {/* Home Page */}
        <Route
          path={ROUTES.Home}
          element={<HomePage />}
        />

        {/* Settings Page */}
        <Route
          path={ROUTES.Settings}
          element={<SettingsPage />}
        />

        {/* GameRoomPage */}
        <Route
          path={ROUTES.GameRooms}
          element={<GameRoomPage />}
        />

        {/* Game Page */}
        <Route
          path={ROUTES.Game + "/:type"}
          element={<GamePage />}
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
            position: "top-right",
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
