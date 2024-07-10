import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

type Question = {
  text: string;
  option1: string;
  option2: string;
};

type Props = {
  question: Question;
  onAnswer: (answer: string) => void;
};

const QuestionComponent: React.FC<Props> = ({ question, onAnswer }) => (
  <View style={styles.container}>
    <Text style={styles.questionText}>{question.text}</Text>
    <Button mode="contained" onPress={() => onAnswer('option1')} style={styles.button}>
      {question.option1}
    </Button>
    <Button mode="contained" onPress={() => onAnswer('option2')} style={styles.button}>
      {question.option2}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    width: '80%',
  },
});

export default QuestionComponent;
