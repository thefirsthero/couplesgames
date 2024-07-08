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
      // alignItems: 'center',
      // justifyContent: 'center',
    }}
  >
    <View style={{ flex: 1, alignItems: 'center'}}>
      <Tooltip title={Locales.t('gameStyleTooltip')}>
        <Text variant="displaySmall">{Locales.t('titleGameStyle')}</Text>
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
    
    <View style={{ flex: 3, alignItems: 'center'}}>
      <Tooltip title={Locales.t('gameSelectTooltip')}>
        <Text variant="displaySmall">{Locales.t('titleGameSelect')}</Text>
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
