import {Text} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Settings from '../../Settings/Settings';
import {version as app_version} from '../../../../package.json';
import Styling from '../../Settings/Screens/Styling/Styling';
import Accounts from '../../Settings/Screens/Accounts/Accounts';
import {Pressable} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {CompositeScreenProps} from '@react-navigation/native';
import ConfigNavigator from '../ConfigNavigator/ConfigNavigator';

type SettingsNavigatorProp = CompositeScreenProps<
  NativeStackScreenProps<BottomTabParamList, 'SettingsNavigator'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = ({navigation}: SettingsNavigatorProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {
          backgroundColor: activeColor.theme,
        },
        headerTintColor: activeColor.text1,
        animation: 'slide_from_right',
      }}>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'TrackIT',
          headerRight: () => (
            <Text style={{color: activeColor.text1}}>v{app_version}</Text>
          ),
        }}
      />
      <SettingsStack.Screen
        name="Styling"
        component={Styling}
        options={{
          title: 'Theme',
        }}
      />
      <SettingsStack.Screen
        name="ConfigNavigator"
        component={ConfigNavigator}
        options={{
          title: 'Configuration',
          header: () => null,
        }}
      />
      <SettingsStack.Screen
        name="Accounts"
        component={Accounts}
        options={{
          title: 'Accounts Settings',
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('AccountForm')}>
              <FontAwesome5 name="plus" size={20} color={activeColor.text1} />
            </Pressable>
          ),
        }}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsNavigator;
