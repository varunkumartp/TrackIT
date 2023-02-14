import {View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Styles} from '../../../../globals/Styles.Styles';
import {Theme} from '../../../../globals/Theme';
import {useIsFocused} from '@react-navigation/native';
import {getAccountsSettings} from '../../../../database/accounts';
import {FlatList} from 'react-native';
import {AccountsGroup} from './AccountsGroup';

const Accounts = () => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [rows, setRows] = useState<AccountsTab[]>([]);

  useEffect(() => {
    getAccountsSettings(setRows);
  }, [focused]);

  return (
    <View style={{...Styles.container, backgroundColor: activeColor.background}}>
      <FlatList
        style={{flex: 1}}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        data={rows}
        renderItem={({item}) => <AccountsGroup data={item.data} title={item.title} key={item.title} setAccounts={setRows} />}
        keyExtractor={item => item.title}
      />
    </View>
  );
};

export default Accounts;
