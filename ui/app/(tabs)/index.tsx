import React, { useState } from 'react';
import { Chip, Divider, Surface, Text, Tooltip } from 'react-native-paper';
import { View } from 'react-native';
import { Games, SegmentedButton } from '@/components';
import Locales from '@/locales';



const TabsHome = () => {
  const [selectedSegment, setSelectedSegment] = useState('solo');

  const handleSegmentChange = (selectedValue: string) => {
    setSelectedSegment(selectedValue);
  };

  return(
  <Surface
    style={{
      flex: 1,
      padding: 32,
    }}
  >
    <View style={{ flex: 1, alignItems: 'center'}}>
      <Tooltip title={Locales.t('gameStyleTooltip')}>
        <Text variant="displaySmall">{Locales.t('titleGameStyle')}</Text>
      </Tooltip>
      <SegmentedButton
        buttons={[
          {
            value: 'solo',
            label: 'Solo',
          },
          {
            value: 'irl',
            label: 'IRL',
          },
          {
            value: 'online',
            label: 'Online',
          },
        ]}
        onPress={handleSegmentChange}
      />
    </View>
    
    <View style={{ flex: 0.25 }}>
    <Divider/>
    </View>
    
    <View style={{ flex: 3, alignItems: 'center'}}>
      <Tooltip title={Locales.t('gameSelectTooltip')}>
        <Text variant="displaySmall">{Locales.t('titleGameSelect')}</Text>
      </Tooltip>
      <Games 
        gameStyle={{ title:  selectedSegment}}
      />
      <Divider style={{ marginTop: 16 }} />
      <Chip textStyle={{ fontFamily: 'JetBrainsMono_400Regular' }}>
        {Locales.t('moreGames')}
      </Chip>
    </View>
  </Surface>
  );
};

export default TabsHome;
