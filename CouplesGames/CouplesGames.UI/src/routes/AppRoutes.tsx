import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './../pages/Home';
import NotFound from './../pages/NotFound';
import RoomPage from './../features/rooms/RoomPage';
import AuthPage from './../features/auth/AuthPage';
import MainLayout from './../layouts/MainLayout';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import Navbar from '../components/Navbar/Navbar';

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <MainLayout>
    <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/" element={<h1>Welcome Home</h1>} />
      </Routes>
    </MainLayout>
  </BrowserRouter>
);

export default AppRoutes;
