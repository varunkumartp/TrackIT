import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {DateFilterDD} from '../../globals/DateFilter.component';
import ButtonGroup from '../Transactions/Form/ButtonGroup';
import Icon from 'react-native-vector-icons/FontAwesome';
import {expenseHeaderSum, incomeHeaderSum} from '../../database/stats';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type StatsProps = NativeStackScreenProps<StatsStackParamList, 'Stats'>;

const emptyAccount = {ACCOUNT_ID: '', ACCOUNT_NAME: '', AMOUNT: 0, SYMBOL: '₹', color: 'white'};

const Stats = ({navigation}: StatsProps) => {
  const isFocused = useIsFocused();
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [type, setType] = useState('EXPENSE');

  const [date, setDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [expense, setExpense] = useState<AccountSum[]>([emptyAccount]);
  const [income, setIncome] = useState<AccountSum[]>([emptyAccount]);
  const [expenseSum, setExpenseSum] = useState(0);
  const [incomeSum, setIncomeSum] = useState(0);
  const [value, setValue] = useState('Periodic');

  useEffect(() => {
    expenseHeaderSum(date, setExpense, setExpenseSum);
    incomeHeaderSum(date, setIncome, setIncomeSum);
  }, [date, isFocused]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <DateFilterDD date={date} setDate={setDate} value={value} setValue={setValue} />

      <ButtonGroup
        data={[
          {
            key: 'INCOME',
            value: `Income  ${income[0].SYMBOL} ${incomeSum}`,
          },
          {
            key: 'EXPENSE',
            value: `Expenses  ${expense[0].SYMBOL} ${expenseSum}`,
          },
        ]}
        defaultKey={'EXPENSE'}
        typeHandler={type => {
          setType(type);
        }}
      />

      <View style={{borderBottomColor: activeColor.theme, borderBottomWidth: 2}}>
        {(type === 'EXPENSE' ? expense[0]['ACCOUNT_ID'] : income[0]['ACCOUNT_ID']) === '' ? (
          <View
            style={{
              width: screenWidth,
              height: screenHeight / 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>No Data Available</Text>
          </View>
        ) : (
          <PieChart
            data={type === 'EXPENSE' ? expense : income}
            width={screenWidth}
            height={screenHeight / 3}
            center={[screenWidth / 4, 0]}
            chartConfig={{
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
            accessor={'AMOUNT'}
            backgroundColor={'transparent'}
            paddingLeft={'0'}
            hasLegend={false}
          />
        )}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={type === 'EXPENSE' ? expense : income}
          keyExtractor={item => item.ACCOUNT_ID}
          renderItem={({item}) => (
            <View
              style={{
                ...AccountsStyles.account,
                borderBottomWidth: 2,
                backgroundColor: activeColor.background,
                borderBottomColor: activeColor.text1,
              }}>
              <Text
                style={{
                  ...AccountsStyles.text,
                  color: activeColor.text1,
                }}>
                <Icon name={'circle'} color={item.color} size={15} />
                {'  '}
                <Text>
                  {Math.round(
                    (item.AMOUNT * 100) / (type === 'EXPENSE' ? expenseSum : incomeSum),
                  ) || '0'}
                  %
                </Text>
                {'  '}
                {item.ACCOUNT_NAME}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...AccountsStyles.text,
                    color: activeColor.text1,
                  }}>
                  {item.SYMBOL} {item.AMOUNT}
                </Text>
                <TouchableOpacity
                  style={{...AccountsStyles.text, alignItems: 'center'}}
                  onPressOut={() =>
                    navigation.navigate('SubStats', {
                      date: date,
                      value: value,
                      PARENT_NAME: item.ACCOUNT_NAME,
                      PARENT_ID: item.ACCOUNT_ID,
                      type: type,
                    })
                  }>
                  <Icon name={'chevron-right'} size={15} color={activeColor.text1} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Stats;

const AccountsStyles = StyleSheet.create({
  account: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 15,
    marginVertical: 15,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
});
