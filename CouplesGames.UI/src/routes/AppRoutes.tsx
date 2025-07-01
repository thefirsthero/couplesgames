import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SoloGamePage from '../features/games/wouldyourather/solo/SoloGamePage';
import RoomPage from '../features/rooms/RoomPage';
import AuthPage from '../features/auth/AuthPage';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';
import MultiplayerGamePage from '../features/games/wouldyourather/multiplayer/MultiplayerGamePage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solo" element={<SoloGamePage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/rooms/:roomId" element={<MultiplayerGamePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
