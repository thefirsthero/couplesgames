import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSoloWYRQuestions } from './api';
import styles from './SoloGamePage.module.css';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const colors = [
  ['#FF6B6B', '#4ECDC4'],
  ['#FFD93D', '#6A4C93'],
  ['#00C49A', '#FF6F91'],
  ['#FF9671', '#00C2A8'],
];

const SoloGamePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Array<{
    id: string;
    optionA: string;
    optionB: string;
  }>>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: questions = [], isLoading, isError } = useQuery({
    queryKey: ['soloQuestions'],
    queryFn: fetchSoloWYRQuestions,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledQuestions(shuffleArray(questions));
    }
  }, [questions]);

  if (loading || isLoading || shuffledQuestions.length === 0) {
    return <div className={styles.loading}>Loading questions...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Failed to load questions.</div>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];
  const colorSet = colors[currentIndex % colors.length];

  const handleSelect = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      setSelected(null);
      setCurrentIndex((prev) => (prev + 1) % shuffledQuestions.length);
    }, 500);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Would You Rather</h1>
      <div className={styles.progress}>
        Question {currentIndex + 1} of {shuffledQuestions.length}
      </div>
      <div className={styles.tiles}>
        {[currentQuestion.optionA, currentQuestion.optionB].map((option, i) => (
          <div
            key={i}
            onClick={() => handleSelect(option)}
            className={`${styles.tile} ${
              selected === option ? styles.tileSelected : ''
            }`}
            style={{ backgroundColor: colorSet[i] }}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoloGamePage;