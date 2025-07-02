// src/components/Navbar/Navbar.tsx

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigate('/auth');
    }
  };

  const quitGame = () => {
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3 onClick={() => navigate('/')} className={styles.title}>Couples Games</h3>
        <button onClick={() => navigate('/')} className={styles.navButton}>Home</button>
        {location.pathname.match(/\/(solo|rooms\/.*)/) && (
          <button onClick={quitGame} className={styles.navButton}>
            Quit Game
          </button>
        )}
      </div>
      <h4><b>Hi, {user ? user.email : 'Guest'}</b></h4>
      <button onClick={handleAuthAction} className={styles.navButton}>
        {user ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

export default Navbar;
