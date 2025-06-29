import apiClient from './../../lib/apiClient';

export const getRooms = async () => {
  const response = await apiClient.get('/api/rooms');
  return response.data;
};
