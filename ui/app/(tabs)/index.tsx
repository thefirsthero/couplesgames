import React from 'react'
import { Chip, Divider, Surface, Text } from 'react-native-paper'

import { SegmentedButton } from '@/components'
import Locales from '@/locales'

const TabsHome = () => (
  <Surface
    style={{
      flex: 1,
      gap: 16,
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >

    <Text variant="displaySmall">{Locales.t('gameStyle')}</Text>
    <SegmentedButton
      buttons={[
        {
          value: 'Solo',
          label: 'Solo',
        },
        {
          value: 'IRL',
          label: 'IRL',
        },
        {
          value: 'Online',
          label: 'Online',
        },
      ]}
    />

    <Divider />

    <Text variant="displaySmall">{Locales.t('titleHome')}</Text>

    <Divider />

    <Text variant="bodyLarge">{Locales.t('openScreenCode')}</Text>

    <Chip textStyle={{ fontFamily: 'JetBrainsMono_400Regular' }}>
      app/(tabs)/index.tsx
    </Chip>
  </Surface>
)

export default TabsHome
