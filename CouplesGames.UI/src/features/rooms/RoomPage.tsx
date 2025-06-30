import React, { useEffect, useState } from 'react';
import apiClient from './../../lib/apiClient';
import { useAuth } from './../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

type Room = {
  id: string;
  questionId: string;
  userIds: string[];
};

const RoomPage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await apiClient.get('/api/rooms');
        setRooms(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    setError('');
    try {
      await apiClient.post('/api/Rooms/create');
      navigate('/rooms'); // Refresh rooms list
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
      await apiClient.post(`/api/Rooms/join/${roomIdToJoin}`);
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
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div>
        {rooms.map((room) => (
          <div key={room.id}>
            <h2>Room ID: {room.id}</h2>
            <p>Players: {room.userIds.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
