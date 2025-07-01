import apiClient from './../../lib/apiClient';

export const createRoom = async () => {
  const response = await apiClient.post('/api/Rooms/create');
  return response.data;
};

export const joinRoom = async (roomId: string) => {
  const response = await apiClient.post(`/api/Rooms/join/${roomId}`);
  return response.data;
};