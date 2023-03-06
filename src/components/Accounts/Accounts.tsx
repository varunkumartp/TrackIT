import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getAccountsTab } from '../../database/accounts';
import { Styles } from '../../globals/Styles.Styles';
import { Theme } from '../../globals/Theme';
import { AccountItem } from './AccountsItem';

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
      style={{
        ...Styles.container,
        backgroundColor: activeColor.background,
        borderTopColor: activeColor.background,
        borderTopWidth: 1,
      }}>
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
