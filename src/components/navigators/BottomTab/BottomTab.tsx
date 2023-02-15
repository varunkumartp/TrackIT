import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accounts from '../../Accounts/Accounts';
import SettingsNavigator from '../SettingsNavigator/SettingsNavigator';
import StatsNavigator from '../StatsNavigator/StatsNavigator';
import Transactions from '../../Transactions/Transactions';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <Tab.Navigator
      initialRouteName="Transactions"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          switch (route.name) {
            case 'Transactions':
              return (
                <FontAwesome5
                  name={'book'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'Accounts':
              return (
                <FontAwesome5
                  name={'coins'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'StatsNavigator':
              return (
                <Ionicons
                  name={'stats-chart'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'SettingsNavigator':
              return (
                <FontAwesome5
                  name={'ellipsis-h'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            default:
              return (
                <FontAwesome5
                  name={'book'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
          }
        },
        tabBarActiveTintColor: activeColor.text1,
        tabBarInactiveTintColor: activeColor.text2,
        tabBarActiveBackgroundColor: activeColor.theme,
        tabBarInactiveBackgroundColor: activeColor.theme,
        tabBarStyle: {
          borderTopWidth: 0,
        },
        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        options={{header: () => null}}
      />
      <Tab.Screen
        name="StatsNavigator"
        component={StatsNavigator}
        options={{
          title: 'Stats',
          header: () => null,
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={Accounts}
        options={{
          title: 'Accounts',
          headerStyle: {
            backgroundColor: activeColor.theme,
          },
          headerTintColor: activeColor.text1,
        }}
      />
      <Tab.Screen
        name="SettingsNavigator"
        component={SettingsNavigator}
        options={{title: 'More', header: () => null}}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
