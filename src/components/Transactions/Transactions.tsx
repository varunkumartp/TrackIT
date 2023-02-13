import {View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AddButton from './AddButton';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {readTransactions} from '../../database/transactions';
import {FlatList} from 'react-native';
import TransactionsGroup from './TransactionsGroup';
import {useIsFocused} from '@react-navigation/native';
import { DateFilter } from '../../globals/DateFilter.component';

const Transactions = () => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [rows, setRows] = useState<readTransactions>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    readTransactions(setRows, setLoading, date);
  }, [date, focused]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: activeColor.background,
          backgroundColor: activeColor.theme,
        }}>
        <DateFilter date={date} setDate={setDate} value={'Periodic'} />
      </View>
      <View style={{flex: 1}}>
        {!loading && (
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            data={rows}
            windowSize={10}
            renderItem={({item}) => <TransactionsGroup data={item.data} title={item.title} />}
            ListFooterComponent={() => <View style={{padding: 50}} />}
          />
        )}
      </View>
      <AddButton />
    </View>
  );
};

export default Transactions;
