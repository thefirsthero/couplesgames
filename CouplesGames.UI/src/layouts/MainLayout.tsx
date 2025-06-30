import React from 'react';
import Navbar from '../components/Navbar/Navbar';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
  </div>
);

export default MainLayout;
