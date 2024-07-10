import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

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
  percentage: number | null;
};

const WouldYouRatherQuestion: React.FC<Props> = ({ question, onAnswer, selectedAnswer, percentage }) => (
  <View style={styles.container}>
    <Button mode="contained" onPress={() => onAnswer('a')} style={styles.button} disabled={selectedAnswer !== null}>
      {question.option_a}
    </Button>
    <Button mode="contained" onPress={() => onAnswer('b')} style={styles.button} disabled={selectedAnswer !== null}>
      {question.option_b}
    </Button>
    {selectedAnswer && (
      <Text style={styles.resultText}>
        {percentage?.toFixed(2)}% of people chose this option.
      </Text>
    )}
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
  resultText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default WouldYouRatherQuestion;
