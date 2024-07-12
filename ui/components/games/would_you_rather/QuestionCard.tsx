import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

type CardProps = {
  option: string;
  selected: boolean;
  onPress: () => void;
  disabled: boolean;
};

const QuestionCard: React.FC<CardProps> = ({ option, selected, onPress, disabled }) => {
  const theme = useTheme();

  const cardStyle = {
    borderColor: selected ? theme.colors.primary : theme.colors.onSurface,
  };

  return (
    <TouchableOpacity
      style={[styles.card, cardStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Card.Content>
        <Title>{option}</Title>
      </Card.Content>
    </TouchableOpacity>
  );
};

export default QuestionCard;

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    card: {
      width: '80%',
      marginTop: 8,
      padding: 16,
      borderRadius: 10,
      borderWidth: 2,
    },
});
