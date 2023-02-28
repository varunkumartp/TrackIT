import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {Styles} from '../../../../globals/Styles.Styles';
import {backupDB, restoreDB} from '../../../../database/backup';

const Backup = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => backupDB()}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Data Backup to device
        </Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        onPress={() => restoreDB()}
        underlayColor={activeColor.theme}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Data Recovery from device
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const ConfigStyle = StyleSheet.create({
  touchableView: {
    padding: 5,
    borderBottomWidth: 1,
  },
  text: {
    ...Styles.text,
    fontSize: 15,
  },
});

export default Backup;
