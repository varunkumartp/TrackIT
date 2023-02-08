import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';

const Accounts = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <Text>Accounts</Text>
    </View>
  );
};

export default Accounts;
