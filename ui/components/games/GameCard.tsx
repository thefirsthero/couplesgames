import * as React from 'react'
import { List, useTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'

interface GameCardProps {
  gamecards: {
    title: string
    icon: string
  }[]
}

const GameCard = ({ gamecards }: GameCardProps) => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    container: {
      margin: 4,
      padding: 16,
      borderRadius: 4,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  })

  return (
    gamecards.map(({ title, icon }) => (
      <List.Item
        key={title}
        style={styles.container}
        title={title}
        left={() => <List.Icon icon={icon} />}
      />
    ))
  )
}

export default GameCard


