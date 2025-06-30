import React, { useEffect } from 'react';
import { useAuth } from './../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SoloGamePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Would You Rather (Solo)</h1>
      <p>Coming soon...</p>
    </div>
  );
};

export default SoloGamePage;
