import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

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

const WouldYouRatherQuestion: React.FC<Props> = ({ question, onAnswer, selectedAnswer }) => (
  <View style={styles.container}>
    <Button mode="contained" onPress={() => onAnswer('a')} style={styles.button} disabled={selectedAnswer !== null}>
      {question.option_a}
    </Button>
    <Button mode="contained" onPress={() => onAnswer('b')} style={styles.button} disabled={selectedAnswer !== null}>
      {question.option_b}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    marginTop: 8,
    width: '80%',
  },
});

export default WouldYouRatherQuestion;
