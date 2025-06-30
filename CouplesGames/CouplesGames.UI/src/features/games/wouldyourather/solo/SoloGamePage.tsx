// src/features/games/wouldyourather/SoloGamePage.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { fetchSoloWYRQuestions } from './api';

type Question = {
  id: string;
  option1: string;
  option2: string;
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchSoloWYRQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions:', error);
      }
    };
    loadQuestions();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (questions.length === 0) return <p>Loading questions...</p>;

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
    <div style={{ padding: '20px' }}>
      <h1>Would You Rather</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        <div
          onClick={() => handleSelect(currentQuestion.option1)}
          style={{
            flex: 1,
            backgroundColor: colorSet[0],
            padding: '40px',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: selected === currentQuestion.option1 ? 0.6 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          {currentQuestion.option1}
        </div>
        <div
          onClick={() => handleSelect(currentQuestion.option2)}
          style={{
            flex: 1,
            backgroundColor: colorSet[1],
            padding: '40px',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: selected === currentQuestion.option2 ? 0.6 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          {currentQuestion.option2}
        </div>
      </div>
    </div>
  );
};

export default SoloGamePage;
