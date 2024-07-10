// app/game-screen.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import QuestionComponent from '@/components/games/would_you_rather/WouldYouRatherQuestion';

type Question = {
  id: number;
  text: string;
  option1: string;
  option2: string;
};

const questions: Question[] = [
  {
    id: 1,
    text: 'Would you rather have the ability to fly or be invisible?',
    option1: 'Fly',
    option2: 'Invisible',
  },
  {
    id: 2,
    text: 'Would you rather have superhuman strength or the ability to run really fast?',
    option1: 'Strength',
    option2: 'Speed',
  },
  {
    id: 3,
    text: 'Would you rather be able to speak any language fluently or have a photographic memory?',
    option1: 'Language',
    option2: 'Memory',
  },
  {
    id: 4,
    text: 'Would you rather be able to eat any food you want without gaining weight or never feel hunger again?',
    option1: 'Eat anything',
    option2: 'Never feel hungry',
  },
  // Add more questions here
];

const GameScreen: React.FC = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ questionId: number; answer: string }[]>([]);

  const handleAnswer = (answer: string) => {
    setResponses([...responses, { questionId: questions[currentQuestionIndex].id, answer }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push('/results');
    }
  };

  return (
    <Surface style={styles.container}>
      <QuestionComponent
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
      />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default GameScreen;
