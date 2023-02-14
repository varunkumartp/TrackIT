import {View, Text} from 'react-native';
import React, {useContext, useState} from 'react';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Settings from '../../Settings/Settings';
import {version as app_version} from '../../../../package.json';
import Styling from '../../Settings/Screens/Styling';

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const {theme} = useContext(ThemeContext);
  //   const [categoryForm, setCategoryForm] = useState(false);
  //   const [subCategoryForm, setSubCategoryForm] = useState(false);
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
          headerRight: () => <Text style={{color: activeColor.text1}}>v{app_version}</Text>,
        }}
      />
      <SettingsStack.Screen
        name="Styling"
        component={Styling}
        options={{
          title: 'Theme',
        }}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsNavigator;
