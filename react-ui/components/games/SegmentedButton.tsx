import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

interface SegmentedButtonProps {
  buttons: {
    value: string;
    label: string;
  }[];
  onPress: (value: string) => void;
}

const SegmentedButton = ({ buttons, onPress }: SegmentedButtonProps) => {
  const [value, setValue] = useState(buttons[0].value);

  const handleValueChange = (selectedValue: string) => {
    setValue(selectedValue);
    onPress(selectedValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={handleValueChange}
        buttons={buttons}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default SegmentedButton;