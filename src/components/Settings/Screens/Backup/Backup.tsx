import React, { useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { backupDB, restoreDB } from '../../../../database/backup';
import { ConfigStyle } from '../../../../globals/Config.Styles';
import { Theme } from '../../../../globals/Theme';

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

export default Backup;
