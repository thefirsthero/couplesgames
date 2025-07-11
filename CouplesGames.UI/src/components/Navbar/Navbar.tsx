import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigate('/auth');
    }
    setIsMenuOpen(false);
  };

  const leaveGame = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <h3 onClick={() => { navigate('/'); closeMenu(); }} className={styles.title}>
          Couples Games
        </h3>

        {/* Desktop links */}
        <div className={styles.navLinks}>
          <button onClick={() => { navigate('/'); closeMenu(); }} className={styles.navButton}>Home</button>
          {location.pathname.match(/\/(solo|rooms\/.*)/) && (
            <button onClick={leaveGame} className={styles.navButton}>
              Leave
            </button>
          )}
          <button onClick={handleAuthAction} className={styles.navButton}>
            {user ? 'Logout' : 'Login'}
          </button>
        </div>

        {/* Mobile menu icon */}
        <button onClick={toggleMenu} className={styles.menuButton}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile side menu */}
      {isMenuOpen && (
        <div className={styles.sideMenu}>
          <button onClick={() => { navigate('/'); closeMenu(); }} className={styles.navButton}>Home</button>
          {location.pathname.match(/\/(solo|rooms\/.*)/) && (
            <button onClick={leaveGame} className={styles.navButton}>
              Leave
            </button>
          )}
          <button onClick={handleAuthAction} className={styles.navButton}>
            {user ? 'Logout' : 'Login'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
