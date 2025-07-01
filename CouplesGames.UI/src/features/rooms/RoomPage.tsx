import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../hooks/useAuth';
import { createRoom, joinRoom } from './api';

const RoomPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleCreateRoom = async () => {
    setError('');
    try {
      await createRoom();
      navigate('/rooms'); // You might adjust this if /rooms renders this same page
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
    <div>
      <p>Logged in as: {user?.email}</p>
      <h1>Rooms</h1>
      <button onClick={handleCreateRoom}>Create Room</button>
      <div>
        <input
          type="text"
          placeholder="Room ID to join"
          value={roomIdToJoin}
          onChange={(e) => setRoomIdToJoin(e.target.value)}
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RoomPage;
