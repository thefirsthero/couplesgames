import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Response = {
  questionId: number;
  answer: 'a' | 'b';
  percentage: number;
};

const ResultScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ responses?: string }>();
  const responses: Response[] = JSON.parse(params.responses ?? '[]');

  const averagePercentage = responses.reduce((acc, response) => acc + response.percentage, 0) / responses.length;

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.content}>Thanks for playing!</Text>
      <Text style={styles.summaryText}>You are: {averagePercentage.toFixed(2)}% common :)</Text>
      <Button mode="contained" onPress={() => router.push('/')}>
        Back to Home
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ResultScreen;
