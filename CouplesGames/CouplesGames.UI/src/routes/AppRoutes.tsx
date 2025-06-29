import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './../pages/Home';
import NotFound from './../pages/NotFound';
import RoomPage from './../features/rooms/RoomPage';
import AuthPage from './../features/auth/AuthPage';
import MainLayout from './../layouts/MainLayout';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
