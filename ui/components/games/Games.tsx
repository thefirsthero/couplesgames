import * as React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { List, Surface } from 'react-native-paper'
import GameCard from './GameCard'

const Games = () => (
  <Surface style={styles.surface} elevation={0}>
  <FlatList
    horizontal
    showsHorizontalScrollIndicator={true}
    data={[
      { title: 'Would You Rather', icon: 'alpha-w-circle' },
      { title: 'Coming Soon...', icon: 'alpha-c-circle'  },
    ]}
    renderItem={({ item }) => (
      <GameCard gamecards={[{ title: item.title, icon: item.icon }]} />
    )}
    
  />
  </Surface>
)

export default Games

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    height: 80,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});