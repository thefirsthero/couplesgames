import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SoloGamePage from '../features/games/wouldyourather/SoloGamePage';
import RoomPage from '../features/rooms/RoomPage';
import AuthPage from '../features/auth/AuthPage';
import NotFound from '../pages/NotFound';
import MainLayout from '../layouts/MainLayout';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solo" element={<SoloGamePage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
