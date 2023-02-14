import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import Stats from '../../Stats/Stats';
import SubStats from '../../Stats/SubStats';
import {useIsFocused} from '@react-navigation/native';

const StatsStack = createNativeStackNavigator<StatsStackParamList>();

const StatsNavigator = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const focused = useIsFocused();

  return (
    <StatsStack.Navigator
      initialRouteName="Stats"
      screenOptions={{
        header: () => null,
        headerStyle: {
          backgroundColor: activeColor.theme,
        },
        headerTintColor: activeColor.text1,
      }}>
      <StatsStack.Screen name="Stats" component={Stats} />
      <StatsStack.Screen name="SubStats" component={SubStats} />
    </StatsStack.Navigator>
  );
};

export default StatsNavigator;
