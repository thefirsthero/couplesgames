import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { signalRService } from '../../../../services/signalRService';
import {
  fetchRoom,
  fetchPlayers,
  updateQuestion,
  resetQuestion,
  submitAnswer,
  getRandomExistingQuestion,
  type Room,
  type Player,
} from './api';
import QuestionForm from './components/QuestionForm';
import AnswerForm from './components/AnswerForm';
import ResultsPopup from './components/ResultsPopup';
import styles from './MultiplayerGamePage.module.css';
import { colors } from '../../../../lib/colors';
import { useLoading } from './../../../../contexts/LoadingContext';
import CopyRoomIdButton from './components/CopyRoomIdButton';

const MultiplayerGamePage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user, token, loading: authLoading } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState<{question: string, answers: Record<string, string>} | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const isSettingQuestion = useRef(false);
  const isResetting = useRef(false);
  const previousRoom = useRef<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize SignalR connection
  useEffect(() => {
    if (!token || !roomId) return;

    const initializeConnection = async () => {
      try {
        await signalRService.initialize(token);
        await signalRService.joinRoom(roomId);
        setIsConnected(true);
        await loadRoomData();
      } catch (error) {
        console.error('Failed to connect to game hub:', error);
        setError('Failed to establish real-time connection');
      }
    };

    initializeConnection();

    return () => {
      signalRService.dispose();
    };
  }, [token, roomId]);

  const checkAndShowResults = (currentRoom: Room, previousRoomState: Room | null) => {
    if (previousRoomState?.currentQuestion && !currentRoom.currentQuestion) {
      setResultsData({
        question: previousRoomState.currentQuestion,
        answers: previousRoomState.answers
      });
      setShowResults(true);
    }
    previousRoom.current = currentRoom;
  };

  // Initial load of room data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!roomId || !user) return;
      startLoading();
      try {
        const roomData = await fetchRoom(roomId);
        setRoom(roomData);
        previousRoom.current = roomData;
        
        const playerData = await fetchPlayers(roomData.userIds);
        setPlayers(playerData);
      } catch (err) {
        setError('Failed to load room data');
        console.error(err);
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    loadInitialData();
  }, [roomId, user]);

  // Set up SignalR event handlers
  useEffect(() => {
    if (!isConnected) return;

    signalRService.onPlayerJoined(async (userId) => {
      if (!room) return;
      console.log('Player joined:', userId);
      const playerData = await fetchPlayers([...room.userIds, userId]);
      setPlayers(playerData);
    });

    signalRService.onAnswerSubmitted(async (data) => {
      console.log('Answer submitted:', data);
      checkAndShowResults(data.roomState, previousRoom.current);
      setRoom(data.roomState);
      const playerData = await fetchPlayers(data.roomState.userIds);
      setPlayers(playerData);
    });

    signalRService.onQuestionUpdated((updatedRoom) => {
      checkAndShowResults(updatedRoom, previousRoom.current);
      setRoom(updatedRoom);
    });

    signalRService.onQuestionReset((updatedRoom) => {
      checkAndShowResults(updatedRoom, previousRoom.current);
      setRoom(updatedRoom);
    });

    return () => {
      signalRService.clearListeners();
    };
  }, [isConnected, room]);

  const loadRoomData = async () => {
    if (!roomId || !user) return;

    try {
      const roomData = await fetchRoom(roomId);
      
      // Check if we've just completed a round
      if (previousRoom.current && 
          previousRoom.current.currentQuestion && 
          !roomData.currentQuestion) {
        setResultsData({
          question: previousRoom.current.currentQuestion,
          answers: previousRoom.current.answers
        });
        setShowResults(true);
      }
      
      setRoom(roomData);
      previousRoom.current = roomData;
      
      const playerData = await fetchPlayers(roomData.userIds);
      setPlayers(playerData);
    } catch (err) {
      setError('Failed to load room data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setRandomQuestionIfNeeded = async () => {
      if (!room || !user || isSettingQuestion.current || isResetting.current) return;

      if (
        room.gameMode === 'existing_questions' &&
        room.userIds.length >= 2 &&
        !room.currentQuestion &&
        !room.askingUserId
      ) {
        isSettingQuestion.current = true;
        try {
          const questionData = await getRandomExistingQuestion();
          if (!questionData) return;

          await updateQuestion(
            roomId!,
            questionData.text,
            user.uid,
            questionData.id
          );
        } catch (err) {
          console.error('Failed to set question:', err);
        } finally {
          isSettingQuestion.current = false;
        }
      }
    };

    setRandomQuestionIfNeeded();
  }, [room, user, roomId]);

  useEffect(() => {
    const resetQuestionIfNeeded = async () => {
      if (!room || isResetting.current) return;
  
      const allAnswered = room.userIds.every(uid => room.answers[uid] !== undefined);
      if (allAnswered && !isSettingQuestion.current) {
        isResetting.current = true;
        try {
          const currentIndex = room.userIds.indexOf(room.askingUserId || '');
          const nextIndex = (currentIndex + 1) % room.userIds.length;
          const nextUserId = room.userIds[nextIndex];
  
          await resetQuestion(room.id, nextUserId);
        } catch (err) {
          console.error('Failed to reset question:', err);
        } finally {
          isResetting.current = false;
        }
      }
    };
  
    resetQuestionIfNeeded();
  }, [room]);  

  const handleSubmitQuestion = async (optionA: string, optionB: string) => {
    if (!roomId || !user) return;

    startLoading();
    try {
      const question = `Would you rather ${optionA} or ${optionB}?`;
      await updateQuestion(roomId, question, user.uid, null);
    } catch (err) {
      setError('Failed to submit question');
      console.error(err);
    } finally {
      stopLoading();
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    if (!roomId || !user) return;

    startLoading();
    try {
      await submitAnswer(roomId, user.uid, answer);
    } catch (err) {
      setError('Failed to submit answer');
      console.error(err);
    } finally {
      stopLoading();
    }
  };

  const getGameStatus = () => {
    if (!room || !user) return 'loading';
  
    if (room.userIds.length < 2) {
      return 'waiting';
    }
  
    if (room.gameMode === 'existing_questions' && !room.currentQuestion) {
      return 'loading';
    }
  
    if (room.gameMode === 'ask_each_other' && room.askingUserId === user.uid && !room.currentQuestion) {
      return 'asking';
    }
  
    if (room.currentQuestion && !room.answers[user.uid] && room.answers[user.uid] !== 'skip') {
      return 'answering';
    }
  
    return 'waiting';
  };  

  const gameStatus = getGameStatus();
  const colorSet = colors[(room?.roundNumber || 1) % colors.length];

  if (authLoading) return <div className={styles.loading}>Loading...</div>;
  if (!user || !token) return <div className={styles.error}>Please login to play</div>;
  if (loading) return <div className={styles.loading}>Loading game...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!room) return <div className={styles.error}>Room not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            {room.gameMode === 'existing_questions'
              ? 'Existing Questions'
              : 'Ask Each Other'}
          </h1>
          <div className={styles.round}>Round {room.roundNumber}</div>
        </div>
        <CopyRoomIdButton roomId={room.id} />
      </div>

      <div className={styles.gameArea}>
        {gameStatus === 'asking' && <QuestionForm onSubmit={handleSubmitQuestion} />}

        {gameStatus === 'answering' && room.currentQuestion && (
          <AnswerForm
            question={room.currentQuestion}
            onSubmit={handleSubmitAnswer}
            colors={colorSet}
          />
        )}

        {gameStatus === 'waiting' && (
          <div className={styles.waiting}>
            {room.userIds.length < 2
              ? 'Waiting for another player to join...'
              : !room.currentQuestion
              ? 'Preparing next question...'
              : room.answers[user.uid] === 'skip'
              ? "You've skipped this question"
              : 'Waiting for other player to choose...'}
          </div>
        )}
      </div>

      {showResults && resultsData && (
        <ResultsPopup
          question={resultsData.question}
          answers={resultsData.answers}
          players={players}
          currentUserUid={user.uid}
          onDismiss={() => setShowResults(false)}
        />
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default MultiplayerGamePage;