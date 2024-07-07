import * as React from 'react'
import { Card } from 'react-native-paper'

interface GameCardProps {
  name: string
  image: string
}

const GameCard: React.FC<GameCardProps> = ({ name, image }) => (
  <Card>
    <Card.Cover source={{ uri: image }} />
    <Card.Title title={name} />
  </Card>
)

export default GameCard
