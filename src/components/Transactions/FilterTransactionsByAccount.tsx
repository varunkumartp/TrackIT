import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { readTransactions } from '../../database/transactions';
import { DateFilterDD } from '../../globals/DateFilter.component';
import { Theme } from '../../globals/Theme';
import TransactionsGroup from './TransactionsGroup';

type FilteredTransactionsProps = NativeStackScreenProps<
  RootStackParamList,
  'FilterTransactionsByAccount'
>;

const FilterTransactionsByAccount = React.memo(
  ({route}: FilteredTransactionsProps) => {
    const focused = useIsFocused();
    const {theme} = useContext(ThemeContext);
    let activeColor = Theme[theme.mode];
    const [rows, setRows] = useState<readTransactions>([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    const [value, setValue] = useState('Periodic');

    useEffect(() => {
      readTransactions(setRows, setLoading, date, route.params.id);
    }, [date, focused]);

    return (
      <View style={{flex: 1, backgroundColor: activeColor.background}}>
        <DateFilterDD
          date={date}
          setDate={setDate}
          value={value}
          setValue={setValue}
        />
        <View style={{flex: 1}}>
          {!loading && (
            <FlatList
              keyboardShouldPersistTaps={'handled'}
              data={rows}
              windowSize={10}
              renderItem={({item}) => (
                <TransactionsGroup data={item.data} title={item.title} />
              )}
            />
          )}
        </View>
      </View>
    );
  },
);

export default FilterTransactionsByAccount;
