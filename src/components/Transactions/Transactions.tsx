import {Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AddButton from './AddButton';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {readTransactions} from '../../database/transactions';
import {FlatList} from 'react-native';
import TransactionsGroup from './TransactionsGroup';
import {CompositeScreenProps, useIsFocused} from '@react-navigation/native';
import {DateFilter} from '../../globals/DateFilter.component';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type TransactionsProp = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Transactions'>,
  NativeStackScreenProps<RootStackParamList>
>;

const Transactions = ({navigation}: TransactionsProp) => {
  const focused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [rows, setRows] = useState<readTransactions>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
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
        <TouchableOpacity
          style={{marginRight: 10, justifyContent: 'center'}}
          onPress={() => navigation.navigate('FilterScreen')}>
          <Icon name="sliders" color={activeColor.text1} size={25} />
        </TouchableOpacity>
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
            ListFooterComponent={() => <View style={{padding: 50}} />}
          />
        )}
      </View>
      <AddButton />
    </View>
  );
};

export default React.memo(Transactions);
