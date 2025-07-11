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

  const leaveGame = () => {
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3 onClick={() => navigate('/')} className={styles.title}>Couples Games</h3>
        <button onClick={() => navigate('/')} className={styles.navButton}>Home</button>
        {location.pathname.match(/\/(solo|rooms\/.*)/) && (
          <button onClick={leaveGame} className={styles.navButton}>
            Leave
          </button>
        )}
      </div>
      <button onClick={handleAuthAction} className={styles.navButton}>
        {user ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

export default Navbar;
