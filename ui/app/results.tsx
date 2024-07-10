import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
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

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <FlatList
        data={responses}
        keyExtractor={(item) => item.questionId.toString()}
        renderItem={({ item }) => (
          <Text style={styles.resultText}>
            Question {item.questionId + 1}: {item.percentage.toFixed(2)}% of people chose your answer
          </Text>
        )}
      />
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
  resultText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ResultScreen;
