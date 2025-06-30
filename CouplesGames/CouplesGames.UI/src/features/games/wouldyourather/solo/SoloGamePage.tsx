import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSoloWYRQuestions } from './api';
import styles from './SoloGamePage.module.css';

type Question = {
  id: string;
  optionA: string;
  optionB: string;
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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: questions = [], isLoading, isError } = useQuery({
    queryKey: ['soloQuestions'],
    queryFn: fetchSoloWYRQuestions,
    staleTime: Infinity, // Never refetch unless manually invalidated
  });

  if (loading || isLoading) return <p>Loading...</p>;
  if (isError || questions.length === 0) return <p>Failed to load questions.</p>;

  const currentQuestion = questions[currentIndex % questions.length];
  const colorSet = colors[currentIndex % colors.length];

  const handleSelect = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      setSelected(null);
      setCurrentIndex((prev) => prev + 1);
    }, 500);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Would You Rather</h1>
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
