import apiClient from './../../lib/apiClient';

export const createRoom = async (gameMode: string) => {
  const response = await apiClient.post('/api/rooms/create', { gameMode });
  return response.data;
};

export const joinRoom = async (roomId: string) => {
  const response = await apiClient.post(`/api/rooms/join/${roomId}`);
  return response.data;
};

export const getRoom = async (roomId: string) => {
  const response = await apiClient.get(`/api/rooms/${roomId}`);
  return response.data;
};

export const submitAnswer = async (roomId: string, userId: string, answer: string) => {
  const response = await apiClient.post('/api/rooms/answer', {
    roomId,
    userId,
    answer
  });
  return response.data;
};

export const getPlayerInfo = async (userId: string) => {
  const response = await apiClient.get(`/api/users/${userId}`);
  return response.data;
};