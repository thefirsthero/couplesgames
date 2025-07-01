import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import apiClient from '../../../../lib/apiClient';
import QuestionForm from './components/QuestionForm';
import AnswerForm from './components/AnswerForm';
import ResultsView from './components/ResultsView';
import styles from './MultiplayerGamePage.module.css';

interface Player {
  uid: string;
  displayName: string;
}

interface Room {
  id: string;
  gameMode: string;
  userIds: string[];
  currentQuestion?: string;
  askingUserId?: string;
  answers: Record<string, string>;
  roundNumber: number;
}

const MultiplayerGamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
//   const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch room data
  useEffect(() => {
    if (!roomId || !user) return;
    
    const fetchRoom = async () => {
      try {
        const response = await apiClient.get(`/api/rooms/${roomId}`);
        setRoom(response.data);
        
        // Fetch player details
        const playerPromises = response.data.userIds.map(async (uid: string) => {
          const playerResponse = await apiClient.get(`/api/users/${uid}`);
          return playerResponse.data;
        });
        
        const playerData = await Promise.all(playerPromises);
        setPlayers(playerData);
      } catch (err) {
        setError('Failed to load room data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoom();
    
    // Set up polling to get room updates
    const interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomId, user]);

  const handleSubmitQuestion = async (optionA: string, optionB: string) => {
    if (!roomId || !user) return;
    
    try {
      const question = `Would you rather ${optionA} or ${optionB}?`;
      await apiClient.post('/api/rooms/update-question', {
        roomId,
        question,
        askingUserId: user.uid
      });
    } catch (err) {
      setError('Failed to submit question');
      console.error(err);
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!roomId || !user) return;
    
    try {
      await apiClient.post('/api/rooms/answer', {
        roomId,
        userId: user.uid,
        answer
      });
    } catch (err) {
      setError('Failed to submit answer');
      console.error(err);
    }
  };

  const getGameStatus = () => {
    if (!room || !user) return 'loading';
    
    // If it's the user's turn to ask a question
    if (room.gameMode === 'ask_each_other' && room.askingUserId === user.uid && !room.currentQuestion) {
      return 'asking';
    }
    
    // If a question is active and user hasn't answered
    if (room.currentQuestion && !room.answers[user.uid]) {
      return 'answering';
    }
    
    // If both players have answered
    if (room.currentQuestion && room.userIds.every(uid => room.answers[uid])) {
      return 'results';
    }
    
    return 'waiting';
  };

  const gameStatus = getGameStatus();

  if (loading) {
    return <div className={styles.loading}>Loading game...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!room) {
    return <div className={styles.error}>Room not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          {room.gameMode === 'existing_questions' 
            ? 'Existing Questions' 
            : 'Ask Each Other'}
        </h1>
        <div className={styles.round}>Round {room.roundNumber}</div>
      </div>

      <div className={styles.players}>
        {players.map(player => (
          <div 
            key={player.uid} 
            className={`${styles.player} ${player.uid === user?.uid ? styles.currentPlayer : ''}`}
          >
            {player.displayName}
            {room.askingUserId === player.uid && (
              <span className={styles.askingBadge}>Asking</span>
            )}
          </div>
        ))}
      </div>

      <div className={styles.gameArea}>
        {gameStatus === 'asking' && (
          <QuestionForm onSubmit={handleSubmitQuestion} />
        )}

        {gameStatus === 'answering' && room.currentQuestion && (
          <AnswerForm 
            question={room.currentQuestion} 
            onSubmit={handleSubmitAnswer} 
          />
        )}

        {gameStatus === 'results' && room.currentQuestion && (
          <ResultsView 
            question={room.currentQuestion} 
            answers={room.answers}
            players={players}
          />
        )}

        {gameStatus === 'waiting' && (
          <div className={styles.waiting}>
            {room.askingUserId === user?.uid 
              ? 'Waiting for you to ask a question...' 
              : 'Waiting for other players...'}
          </div>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default MultiplayerGamePage;