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
      <Route path='/' element={<BaseLayout><HomePage /></BaseLayout>} />
      <Route path='/settings' element={<BaseLayout><SettingsPage /></BaseLayout>} />
      <Route path='/rooms' element={<BaseLayout><GameRoomPage /></BaseLayout>} />
      <Route path='/game' element={<BaseLayout><GamePage /></BaseLayout>} />
    </Routes>
  );
}

export default App;
