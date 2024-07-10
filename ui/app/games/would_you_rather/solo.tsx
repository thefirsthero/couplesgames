import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WouldYouRatherQuestion from '@/components/games/would_you_rather/WouldYouRatherQuestion';

type Question = {
  option_a: string;
  votes_a: number;
  option_b: string;
  votes_b: number;
};

const questions: Question[] = [
  {
    option_a: 'Be painted by Van Gogh',
    votes_a: 462554,
    option_b: 'Be painted by Da Vinci',
    votes_b: 1121946,
  },
  {
    option_a: 'Run 26 miles',
    votes_a: 915383,
    option_b: 'Swim 5 miles',
    votes_b: 901412,
  },
  {
    option_a: 'Speak every language except the language of the country you\'re currently in',
    votes_a: 597685,
    option_b: 'Speak only the language of the country you\'re in, but know the meaning of every single word in that language',
    votes_b: 1084849,
  },
  // Add more questions here
];

const WouldYouRatherGameScreen: React.FC = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ questionId: number; answer: 'a' | 'b'; percentage: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<'a' | 'b' | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleAnswer = (answer: 'a' | 'b') => {
    const currentQuestion = questions[currentQuestionIndex];
    const totalVotes = currentQuestion.votes_a + currentQuestion.votes_b;
    const percentage =
      answer === 'a'
        ? (currentQuestion.votes_a / totalVotes) * 100
        : (currentQuestion.votes_b / totalVotes) * 100;

    setResponses([...responses, { questionId: currentQuestionIndex, answer, percentage }]);
    setSelectedAnswer(answer);
    setPercentage(percentage);
    setSnackbarVisible(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setPercentage(null);
        setSnackbarVisible(false);
      } else {
        router.replace({
          pathname: '/results',
          params: { responses: JSON.stringify([...responses, { questionId: currentQuestionIndex, answer, percentage }]) },
        });
      }
    }, 2000);
  };

  return (
    <Surface style={styles.container}>
      <WouldYouRatherQuestion
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {percentage !== null && `Nice! ${percentage.toFixed(2)}% of people chose this option.`}
      </Snackbar>
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

export default WouldYouRatherGameScreen;
