import React from 'react';
import {  View, StyleSheet } from 'react-native';
import {  Divider } from 'react-native-paper';
import QuestionCard from '@/components/games/would_you_rather/QuestionCard';

type Question = {
  option_a: string;
  votes_a: number;
  option_b: string;
  votes_b: number;
};

type Props = {
  question: Question;
  onAnswer: (answer: 'a' | 'b') => void;
  selectedAnswer: 'a' | 'b' | null;
};

const WouldYouRatherQuestion: React.FC<Props> = ({ question, onAnswer, selectedAnswer }) => {
  const disabled = selectedAnswer !== null;

  const handleAnswer = (answer: 'a' | 'b') => {
    onAnswer(answer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionCardContainer}>
        <QuestionCard
          option={question.option_a}
          selected={selectedAnswer === 'a'}
          onPress={() => handleAnswer('a')}
          disabled={disabled}
        />
      </View>

      <View style={styles.dividerContainer}>
        <Divider />
      </View>

      <View style={styles.questionCardContainer}>
        <QuestionCard
          option={question.option_b}
          selected={selectedAnswer === 'b'}
          onPress={() => handleAnswer('b')}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  questionCardContainer: {
    width: '100%',
    margin: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
  },
  dividerContainer: {
    width: '100%',
  },
});

export default WouldYouRatherQuestion;

