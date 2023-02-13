import {View, Text, Pressable} from 'react-native';
import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Accounts from '../../Accounts/Accounts';
import Stats from '../../Stats/Stats';
import StatsNavigator from '../StatsNavigator/StatsNavigator';
import Transactions from '../../Transactions/Transactions';
import Settings from '../../Settings/Settings';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator<BottomTabParamList>();
type BottomTabProps = NativeStackScreenProps<RootStackParamList, 'BottomTab'>;

const BottomTab = ({route, navigation}: BottomTabProps) => {
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
                  color={focused ? activeColor.text : activeColor.background}
                />
              );
            case 'Accounts':
              return (
                <FontAwesome5
                  name={'coins'}
                  size={20}
                  color={focused ? activeColor.text : activeColor.background}
                />
              );
            case 'StatsNavigator':
              return (
                <Ionicons
                  name={'stats-chart'}
                  size={20}
                  color={focused ? activeColor.text : activeColor.background}
                />
              );
            case 'More':
              return (
                <FontAwesome5
                  name={'ellipsis-h'}
                  size={20}
                  color={focused ? activeColor.text : activeColor.background}
                />
              );
            default:
              return (
                <FontAwesome5
                  name={'book'}
                  size={20}
                  color={focused ? activeColor.text : activeColor.background}
                />
              );
          }
        },
        tabBarActiveTintColor: activeColor.text,
        tabBarInactiveTintColor: activeColor.background,
        tabBarActiveBackgroundColor: activeColor.theme,
        tabBarInactiveBackgroundColor: activeColor.theme,
        tabBarStyle: {
          borderTopWidth: 0,
        },
      })}>
      <Tab.Screen name="Transactions" component={Transactions} options={{header: () => null}} />
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
          headerTintColor: activeColor.text,
          headerRight: () => (
            <Pressable style={{marginRight: 15}} onPress={() => navigation.navigate('AccountForm')}>
              <FontAwesome5 name="plus" size={20} color={activeColor.text} />
            </Pressable>
          ),
        }}
      />
      <Tab.Screen name="More" component={Settings} options={{header: () => null}} />
    </Tab.Navigator>
  );
};

export default BottomTab;
