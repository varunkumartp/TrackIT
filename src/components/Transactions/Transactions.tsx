import {View, Text} from 'react-native';
import React, {useContext, useEffect} from 'react';
import AddButton from './AddButton';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {getAccounts} from '../../database/accounts';

const Transactions = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <Text>Transactions</Text>
      <AddButton />
    </View>
  );
};

export default Transactions;
