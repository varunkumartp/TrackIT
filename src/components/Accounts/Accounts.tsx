import {View, FlatList, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {Styles} from '../../globals/Styles.Styles';
import {getAccountsTab} from '../../database/accounts';
import {AccountItem} from './AccountsItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/native';

const Accounts = () => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);

  let activeColor = Theme[theme.mode];
  const [rows, setRows] = useState<AccountsGroup[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    getAccountsTab(setRows);
  }, [focused]);

  return (
    <View
      style={{...Styles.container, backgroundColor: activeColor.background}}>
      <FlatList
        style={{flex: 1}}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        data={rows}
        renderItem={({item}) => (
          <TouchableOpacity
            disabled={item.NUMBER % 1000 === 0}
            onPress={() =>
              navigation.navigate('FilterTransactionsByAccount', {
                id: item.ID,
                account: item.NAME,
              })
            }>
            <AccountItem data={item} key={item.ID} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.ID}
      />
    </View>
  );
};

export default React.memo(Accounts);
