import apiClient from '../../../../lib/apiClient';

export const fetchSoloWYRQuestions = async () => {
  const response = await apiClient.get('/api/questions/solowyr');
  return response.data;
};
