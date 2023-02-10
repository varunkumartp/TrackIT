import {View, Text, StyleSheet, FlatList, TouchableHighlight} from 'react-native';
import React, {Fragment, useContext} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Theme} from '../../globals/Theme';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

interface TransactionGroupProp {
  title: string;
  data: transactions[];
}

interface TransactionHeaderProp {
  date: string;
}

interface TransactionItemProp {
  data: transactions;
}

const TransactionHeader = React.memo(({date}: TransactionHeaderProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{...HeaderStyles.header, backgroundColor: activeColor.theme}}>
      <Text style={{...HeaderStyles.headerText, color: activeColor.text}}>{date}</Text>
    </View>
  );
});

const TransactionItem = React.memo(({data}: TransactionItemProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={ItemStyles.accounts}>
      <View
        style={{
          alignItems: 'center',
          borderBottomWidth: 1,
        }}>
        <Text style={{...ItemStyles.headerText, color: activeColor.text}}>{data.DESCRIPTION}</Text>
      </View>
      <View style={{marginVertical: 5}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              ...ItemStyles.text,
              color: activeColor.text,
              textAlign: 'left',
            }}>
            {data.DEBIT_PARENT} - {data.DEBIT_NAME}
          </Text>
          <Text
            style={{
              ...ItemStyles.text,
              textAlign: 'right',
              color: data.DEBIT_DIR < 0 ? activeColor.red : activeColor.blue,
            }}>
            {data.SYMBOL} {data.AMOUNT_LOC}{' '}
            <Icon name={data.DEBIT_DIR < 0 ? 'arrow-down' : 'arrow-up'} size={14} />
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              ...ItemStyles.text,
              color: activeColor.text,
              textAlign: 'left',
            }}>
            {data.CREDIT_PARENT} - {data.CREDIT_NAME}
          </Text>
          <Text
            style={{
              ...ItemStyles.text,
              textAlign: 'right',
              color: data.CREDIT_DIR < 0 ? activeColor.red : activeColor.blue,
            }}>
            {data.SYMBOL} {data.AMOUNT_LOC}{' '}
            <Icon name={data.CREDIT_DIR < 0 ? 'arrow-down' : 'arrow-up'} size={14} />
          </Text>
        </View>
      </View>
    </View>
  );
});

const TransactionsGroup = React.memo(({title, data}: TransactionGroupProp) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <Fragment>
      <TransactionHeader date={title} />
      <FlatList
        data={data}
        keyboardShouldPersistTaps={'handled'}
        renderItem={({item}) => (
          <TouchableHighlight
            onPress={() =>
              navigation.navigate('EditForm', {
                data: {
                  ...item,
                  CREDIT_ID: item.TYPE === 'EXPENSE' ? item.DEBIT_ID : item.CREDIT_ID,
                  DEBIT_ID: item.TYPE === 'EXPENSE' ? item.CREDIT_ID : item.DEBIT_ID,
                  CREDIT_NAME: item.TYPE === 'EXPENSE' ? item.DEBIT_NAME : item.CREDIT_NAME,
                  DEBIT_NAME: item.TYPE === 'EXPENSE' ? item.CREDIT_NAME : item.DEBIT_NAME,
                },
              })
            }
            activeOpacity={0.5}
            underlayColor={activeColor.background}>
            <TransactionItem data={item} />
          </TouchableHighlight>
        )}
      />
    </Fragment>
  );
});

const HeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },

  headerText: {
    fontSize: 17,
    marginHorizontal: 10,
    marginVertical: 5,
    fontWeight: 'bold',
  },
});

const ItemStyles = StyleSheet.create({
  accounts: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 15,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    marginVertical: 5,
  },
});

export default TransactionsGroup;
