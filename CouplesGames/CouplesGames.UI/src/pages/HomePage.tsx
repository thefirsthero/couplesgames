import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  const tileStyle: React.CSSProperties = {
    backgroundColor: '#111',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    padding: '40px',
    margin: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    width: '200px',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const tilesWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1>Select a Game</h1>
      <div style={tilesWrapperStyle}>
        <div
          style={tileStyle}
          onClick={() => navigate('/solo')}
        >
          Would You Rather (Solo)
        </div>
        <div
          style={tileStyle}
          onClick={() => navigate('/rooms')}
        >
          Would You Rather (Multiplayer)
        </div>
      </div>
    </div>
  );
};

export default HomePage;
