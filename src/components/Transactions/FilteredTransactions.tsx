import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {readTransactions} from '../../database/transactions';
import {FlatList} from 'react-native';
import TransactionsGroup from './TransactionsGroup';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Dropdown} from 'react-native-element-dropdown';
import DateFilter from './DateFilter';

type FilteredTransactionsProps = NativeStackScreenProps<RootStackParamList, 'FilteredTransactions'>;

const data = [
  {label: 'Period ', value: 'Periodic'},
  {label: 'Annual ', value: 'yearly'},
];

const FilteredTransactions = ({route, navigation}: FilteredTransactionsProps) => {
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

  const dropDownHandler = (type: string) => {
    if (type === 'Periodic') {
      setDate({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } else {
      setDate({
        month: 0,
        year: date.year,
      });
    }
    setValue(type);
  };

  useEffect(() => {
    readTransactions(setRows, setLoading, date, route.params.id);
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
        <DateFilter date={date} setDate={setDate} value={value} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Dropdown
            selectedTextStyle={{
              fontSize: 15,
              fontWeight: 'bold',
              color: activeColor.text,
            }}
            activeColor={activeColor.background}
            iconColor={activeColor.text}
            itemTextStyle={{color: activeColor.text}}
            containerStyle={{
              backgroundColor: activeColor.theme,
              borderColor: activeColor.theme,
            }}
            data={data}
            labelField="label"
            valueField="value"
            value={value}
            onChange={item => dropDownHandler(item.value)}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        {!loading && (
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            data={rows}
            windowSize={10}
            renderItem={({item}) => <TransactionsGroup data={item.data} title={item.title} />}
          />
        )}
      </View>
    </View>
  );
};

export default FilteredTransactions;
