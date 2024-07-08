import * as React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { List, Surface } from 'react-native-paper'
import GameCard from './GameCard'

const Games = () => {
  const data = Array.from({ length: 22 }, (_, index) => ({
    id: index,
    title: `Game Would You Rather ${index + 1}`,
    icon: `alpha-${String.fromCharCode(97 + (index % 4))}-circle`,
  }))

  const renderItem = ({ item }: { item: { id: number, title: string, icon: string } }) => (
    <GameCard gamecards={[{ title: item.title, icon: item.icon }]} />
  )

  return (
    <Surface style={styles.surface} elevation={0}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </Surface>
  )
}

export default Games

const styles = StyleSheet.create({
  surface: {
    flex: 1,
  },
})