import * as React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'

interface SegmentedButtonProps {
  buttons: {
    value: string
    label: string
  }[]
}

const SegmentedButton = ({ buttons }: SegmentedButtonProps) => {
  const [value, setValue] = React.useState(buttons[0].value)

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={buttons}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})

export default SegmentedButton
