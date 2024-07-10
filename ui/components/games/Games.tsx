import * as React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { List, Surface } from 'react-native-paper'
import GameCard from './GameCard'

const Games = () => {
  const data = [
    {
      id: 1,
      title: 'Would You Rather',
      icon: 'alpha-w-circle',
      route: '/games/would_you_rather/solo',
    },
    {
      id: 2,
      title: 'Truth or Dare',
      icon: 'alpha-b-circle',
      route: '/games/truth_or_dare',
    }
  ]

  const renderItem = ({ item }: { item: { id: number, title: string, icon: string, route: string } }) => (
    <GameCard gamecards={[{ title: item.title, icon: item.icon, route: item.route }]} />
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