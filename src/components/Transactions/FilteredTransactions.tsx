import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {readTransactions} from '../../database/transactions';
import {FlatList} from 'react-native';
import TransactionsGroup from './TransactionsGroup';
import {useIsFocused} from '@react-navigation/native';
import MonthFilter from './MonthFilter';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type FilteredTransactionsProps = NativeStackScreenProps<
  RootStackParamList,
  'FilteredTransactions'
>;

const FilteredTransactions = ({
  route,
  navigation,
}: FilteredTransactionsProps) => {
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
    readTransactions(setRows, setLoading, date, route.params.id);
  }, [date, focused]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <MonthFilter date={date} setDate={setDate} setLoading={setLoading} />
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
};

export default FilteredTransactions;
