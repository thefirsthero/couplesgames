import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3 onClick={() => navigate('/')} className={styles.title}>Couples Games</h3>
        <button onClick={() => navigate('/')} className={styles.navButton}>Home</button>
      </div>
      <button onClick={handleAuthAction} className={styles.navButton}>
        {user ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

export default Navbar;
