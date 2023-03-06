import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext';
import { expenseHeaderSum, incomeHeaderSum } from '../../database/stats';
import { DateFilterDD } from '../../globals/DateFilter.component';
import { Theme } from '../../globals/Theme';
import ButtonGroup from '../Transactions/Form/ButtonGroup';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type StatsProps = NativeStackScreenProps<StatsStackParamList, 'Stats'>;

const emptyAccount = {
  ACCOUNT_ID: '',
  ACCOUNT_NAME: '',
  AMOUNT: 0,
  SYMBOL: '₹',
  color: 'white',
};

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
      <DateFilterDD
        date={date}
        setDate={setDate}
        value={value}
        setValue={setValue}
      />
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
      <View
        style={{
          borderBottomColor: activeColor.theme,
          borderBottomWidth: 2,
          borderTopColor: activeColor.background,
          borderTopWidth: 1,
        }}>
        {(type === 'EXPENSE'
          ? expense[0]['ACCOUNT_ID']
          : income[0]['ACCOUNT_ID']) === '' ? (
          <View style={AccountsStyles.noData}>
            <Text>No Data Available</Text>
          </View>
        ) : (
          <PieChart
            data={type === 'EXPENSE' ? expense : income}
            width={screenWidth}
            height={screenHeight / 3}
            center={[screenWidth / 4, 0]}
            chartConfig={{
              color: () => activeColor.text1,
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
                    (item.AMOUNT * 100) /
                      (type === 'EXPENSE' ? expenseSum : incomeSum),
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
                  <Icon
                    name={'chevron-right'}
                    size={15}
                    color={activeColor.text1}
                  />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 5,
  },
  account: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  text: {
    fontSize: 15,
    marginVertical: 15,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  noData: {
    width: screenWidth,
    height: screenHeight / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
