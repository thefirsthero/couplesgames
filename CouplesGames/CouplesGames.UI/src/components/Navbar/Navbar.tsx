import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 20px',
      background: '#eee'
    }}>
      <h3 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Would You Rather</h3>

      <button onClick={handleAuthAction}>
        {user ? 'Logout' : 'Login'}
      </button>
    </nav>
  );
};

export default Navbar;
