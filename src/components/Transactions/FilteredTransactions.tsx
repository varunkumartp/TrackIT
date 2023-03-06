import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { readFilteredTransactions } from '../../database/transactions';
import { DateFilterDD } from '../../globals/DateFilter.component';
import { FormStyles } from '../../globals/Form.Styles';
import { Theme } from '../../globals/Theme';
import TransactionsGroup from './TransactionsGroup';

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
  const [value, setValue] = useState('Periodic');

  useEffect(() => {
    readFilteredTransactions(
      setRows,
      setLoading,
      date,
      route.params.id,
      route.params.amount,
    );
  }, [date, focused]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <DateFilterDD
        date={date}
        setDate={setDate}
        value={value}
        setValue={setValue}
      />
      <View style={{...FormStyles.buttonField}}>
        <Pressable
          style={{
            ...FormStyles.pressable,
            backgroundColor: activeColor.theme,
          }}
          onPress={() => navigation.navigate('BottomTab')}>
          <Text style={{...FormStyles.buttonText, color: activeColor.text1}}>
            Close
          </Text>
        </Pressable>
      </View>
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

export default React.memo(FilteredTransactions);
