import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { Theme } from '../../../globals/Theme';
import Accounts from '../../Accounts/Accounts';
import Transactions from '../../Transactions/Transactions';
import SettingsNavigator from '../SettingsNavigator/SettingsNavigator';
import StatsNavigator from '../StatsNavigator/StatsNavigator';

const Tab = createBottomTabNavigator<BottomTabParamList>();
type BottomTabProps = NativeStackScreenProps<RootStackParamList, 'BottomTab'>;

const BottomTab = ({navigation}: BottomTabProps) => {
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
                <Icon
                  name={'book'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'Accounts':
              return (
                <Icon
                  name={'coins'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'StatsNavigator':
              return (
                <Icon
                  name={'chart-pie'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            case 'SettingsNavigator':
              return (
                <Icon
                  name={'ellipsis-h'}
                  size={20}
                  color={focused ? activeColor.text1 : activeColor.text2}
                />
              );
            default:
              return (
                <Icon
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
          headerRight: () => (
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => navigation.navigate('IncExpStats')}>
              <Icon name={'chart-bar'} size={20} color={activeColor.text1} />
            </TouchableOpacity>
          ),
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
