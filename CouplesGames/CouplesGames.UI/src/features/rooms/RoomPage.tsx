import React, { useEffect, useState } from 'react';
import apiClient from './../../lib/apiClient';
import { useAuth } from './../../hooks/useAuth';

type Room = {
  id: string;
  questionId: string;
  userIds: string[];
};

const RoomPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await apiClient.get('/api/rooms');
      setRooms(response.data);
    };
    fetchRooms();
  }, []);

  return (
    <div>
      <p>Logged in as: {user?.email}</p>
      <h1>Rooms</h1>
      <div>
        {rooms.map((room) => (
          <div key={room.id}>{room.id}</div>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;
