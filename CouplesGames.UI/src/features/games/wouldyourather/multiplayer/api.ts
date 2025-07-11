import apiClient from '../../../../lib/apiClient';
import { fetchSoloWYRQuestions } from '../solo/api';

export interface Player {
  uid: string;
  displayName: string;
}

export interface PreviousRoundData {
  question?: string;
  askingUserId?: string;
  answers: Record<string, string>;
  roundNumber?: number; // Added for clarity
}

export interface Room {
  id: string;
  gameMode: string;
  userIds: string[];
  currentQuestion?: string;
  askingUserId?: string;
  answers: Record<string, string>;
  previousRound?: PreviousRoundData;
  roundNumber: number;
}  

export const fetchRoom = async (roomId: string) => {
  const response = await apiClient.get(`/api/rooms/${roomId}`);
  return response.data as Room;
};

export const fetchPlayers = async (userIds: string[]) => {
  const playerPromises = userIds.map(async (uid: string) => {
    const playerResponse = await apiClient.get(`/api/users/${uid}`);
    return playerResponse.data as Player;
  });
  return Promise.all(playerPromises);
};

export const updateQuestion = async (
  roomId: string,
  question: string,
  askingUserId: string,
  questionId: string | null
) => {
  await apiClient.post('/api/rooms/update-question', {
    roomId,
    question,
    askingUserId,
    questionId
  });
};

export const resetQuestion = async (roomId: string, askingUserId: string) => {
  await apiClient.post('/api/rooms/reset-question', {
    roomId,
    askingUserId,
  });
};

export const submitAnswer = async (
  roomId: string,
  userId: string,
  answer: string
) => {
  await apiClient.post('/api/rooms/answer', {
    roomId,
    userId,
    answer,
  });
};

export const getRandomExistingQuestion = async (): Promise<{ text: string, id: string } | null> => {
  const questions = await fetchSoloWYRQuestions();
  if (questions.length === 0) return null;

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  return {
    text: `Would you rather ${randomQuestion.optionA} or ${randomQuestion.optionB}?`,
    id: randomQuestion.id
  };
};