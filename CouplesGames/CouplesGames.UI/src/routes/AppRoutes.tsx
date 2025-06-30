import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './../pages/Home';
import NotFound from './../pages/NotFound';
import RoomPage from './../features/rooms/RoomPage';
import AuthPage from './../features/auth/AuthPage';
import MainLayout from './../layouts/MainLayout';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/rooms" element={<RoomPage />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="*" element={<NotFound />} />
</Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
