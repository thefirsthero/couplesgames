import apiClient from '../../../../lib/apiClient';

export const fetchSoloWYRQuestions = async () => {
  const response = await apiClient.get('/api/questions/solowyr');
  console.log(response.data);
  return response.data;
};
