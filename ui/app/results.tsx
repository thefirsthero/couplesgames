import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const ResultScreen: React.FC = () => {
  const router = useRouter();

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.content}>Thanks for playing!</Text>
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
});

export default ResultScreen;
