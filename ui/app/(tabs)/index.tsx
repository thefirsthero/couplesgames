import React from 'react';
import { Chip, Divider, Surface, Text, Tooltip } from 'react-native-paper';
import { View } from 'react-native';
import { Games, SegmentedButton } from '@/components';
import Locales from '@/locales';

const TabsHome = () => (
  <Surface
    style={{
      flex: 1,
      padding: 32,
    }}
  >
    <View style={{ flex: 1 }}>
      <Tooltip title={Locales.t('gameStyleTooltip')}>
        <Text variant="displaySmall">{Locales.t('gameStyle')}</Text>
      </Tooltip>
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
    </View>
    
    <View style={{ flex: 0.25 }}>
    <Divider/>
    </View>
    

    <View style={{ flex: 3 }}>
      <Tooltip title={Locales.t('titleHomeTooltip')}>
        <Text variant="displaySmall">{Locales.t('titleHome')}</Text>
      </Tooltip>
      <Games />
      <Divider style={{ marginTop: 16 }} />
      <Chip textStyle={{ fontFamily: 'JetBrainsMono_400Regular' }}>
        {Locales.t('moreGames')}
      </Chip>
    </View>
  </Surface>
);

export default TabsHome;
