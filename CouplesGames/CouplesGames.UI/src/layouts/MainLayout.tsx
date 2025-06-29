import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <nav>
      <Link to="/">Home</Link> | <Link to="/rooms">Rooms</Link> | <Link to="/auth">Login</Link>
    </nav>
    <main>{children}</main>
  </div>
);

export default MainLayout;
