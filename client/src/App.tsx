import React from 'react';
import { Route, Routes } from 'react-router-dom';

import BaseLayout from './layouts/base_layout/BaseLayout';
import HomePage from './pages/home/HomePage';
import SettingsPage from './pages/settings/SettingsPage';
import GameRoomPage from './pages/game_rooms/GameRoomPage';
import GamePage from './pages/game/GamePage';

function App() {
  return (
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
          <BaseLayout headerTitle={"Game"}>
            <GamePage />
          </BaseLayout>
        }
      />
    </Routes>
  );
}

export default App;
