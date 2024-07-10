// app/new-screen.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useNavigation } from 'expo-router';

const NewScreen = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Would You Rather',
    });
  }, [navigation]);

  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>New Screen</Text>
      <Text style={styles.content}>
        This is a new screen using React Native Paper.
      </Text>
      <Button mode="contained" onPress={() => console.log('Button pressed')}>
        Press me
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

export default NewScreen;
