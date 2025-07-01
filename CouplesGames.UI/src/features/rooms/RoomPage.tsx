import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../hooks/useAuth';
import { createRoom, joinRoom } from './api';
import styles from './RoomPage.module.css';

const RoomPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [error, setError] = useState('');
  const [gameMode, setGameMode] = useState<'existing_questions' | 'ask_each_other'>('existing_questions');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleCreateRoom = async () => {
    setError('');
    try {
      const room = await createRoom(gameMode);
      navigate(`/rooms/${room.id}`);
    } catch (err) {
      setError('Failed to create room');
      console.error(err);
    }
  };

  const handleJoinRoom = async () => {
    setError('');
    if (!roomIdToJoin) {
      setError('Please enter a room ID');
      return;
    }
    try {
      await joinRoom(roomIdToJoin);
      navigate(`/rooms/${roomIdToJoin}`);
    } catch (err) {
      setError('Failed to join room');
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>Multiplayer Game</h1>
      <div className={styles.modeSelector}>
        <h2>Select Game Mode:</h2>
        <div className={styles.modeButtons}>
          <button
            className={`${styles.modeButton} ${gameMode === 'existing_questions' ? styles.active : ''}`}
            onClick={() => setGameMode('existing_questions')}
          >
            Existing Questions
          </button>
          <button
            className={`${styles.modeButton} ${gameMode === 'ask_each_other' ? styles.active : ''}`}
            onClick={() => setGameMode('ask_each_other')}
          >
            Ask Each Other
          </button>
        </div>
        <p className={styles.modeDescription}>
          {gameMode === 'existing_questions' 
            ? 'Answer pre-made questions together' 
            : 'Take turns asking each other questions'}
        </p>
      </div>

      <div className={styles.createSection}>
        <button 
          onClick={handleCreateRoom} 
          className={styles.createButton}
        >
          Create Room
        </button>
      </div>

      <div className={styles.joinSection}>
        <h2>Join Existing Room</h2>
        <div className={styles.joinForm}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomIdToJoin}
            onChange={(e) => setRoomIdToJoin(e.target.value)}
            className={styles.roomInput}
          />
          <button 
            onClick={handleJoinRoom} 
            className={styles.joinButton}
          >
            Join Room
          </button>
        </div>
      </div>
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default RoomPage;