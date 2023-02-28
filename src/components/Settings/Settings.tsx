import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';

type SettingsProps = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

const Settings = ({navigation}: SettingsProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View
      style={{
        ...SettingsStyles.parentContainer,
        backgroundColor: activeColor.background,
      }}>
      <View style={SettingsStyles.rowContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ConfigNavigator')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <Ionicons name={'settings'} size={50} color={activeColor.text1} />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            Configuration
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Accounts')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <FontAwesome5 name={'coins'} size={50} color={activeColor.text1} />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            Accounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Styling')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <Ionicons
              name={'color-palette'}
              size={50}
              color={activeColor.text1}
            />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            Styling
          </Text>
        </TouchableOpacity>
      </View>
      <View style={SettingsStyles.rowContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Passcode')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <FontAwesome5
              name={'unlock-alt'}
              size={50}
              color={activeColor.text1}
            />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            Passcode
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => navigation.navigate('PCManager')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <FontAwesome5
              name={'desktop'}
              size={50}
              color={activeColor.text1}
            />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            PC Manager
          </Text>
        </TouchableOpacity>*/}

        <TouchableOpacity
          onPress={() => navigation.navigate('Backup')}
          style={SettingsStyles.container}>
          <Text style={SettingsStyles.containerIcon}>
            <Ionicons name={'refresh'} size={50} color={activeColor.text1} />
          </Text>
          <Text
            style={{...SettingsStyles.containerText, color: activeColor.text1}}>
            Backup
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingsStyles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    // backgroundColor: activeColor.primary,
  },
  rowContainer: {
    // flex: 1,
    marginVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  containerIcon: {
    textAlign: 'center',
  },
  containerText: {
    textAlign: 'center',
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
    // color: activeColor.theme,
  },
});

export default Settings;
