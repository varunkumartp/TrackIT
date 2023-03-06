import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../contexts/ThemeContext';
import { subHeaderSum } from '../../database/stats';
import { DateFilter } from '../../globals/DateFilter.component';
import { Styles } from '../../globals/Styles.Styles';
import { Theme } from '../../globals/Theme';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type SubStatsProps = CompositeScreenProps<
  NativeStackScreenProps<StatsStackParamList, 'SubStats'>,
  NativeStackScreenProps<RootStackParamList>
>;

const emptyAccount = {
  ACCOUNT_ID: '',
  ACCOUNT_NAME: '',
  AMOUNT: 0,
  SYMBOL: '₹',
  color: 'white',
};

const SubStats = ({route, navigation}: SubStatsProps) => {
  const {PARENT_ID, PARENT_NAME, type, value} = route.params;
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [date, setDate] = useState(route.params.date);
  const [subAccount, setSubAccount] = useState<AccountSum[]>([emptyAccount]);
  const [amountSum, setAmountSum] = useState(0);

  useEffect(() => {
    subHeaderSum(date, PARENT_ID, type, setSubAccount, setAmountSum);
  }, [date]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View
        style={{
          ...AccountsStyles.header,
          borderBottomColor: activeColor.background,
          backgroundColor: activeColor.theme,
        }}>
        <View>
          <Text style={{...Styles.text, color: activeColor.text1}}>
            {PARENT_NAME}
          </Text>
        </View>
        <View>
          <DateFilter date={date} setDate={setDate} value={value} />
        </View>
      </View>
      <View
        style={{borderBottomColor: activeColor.theme, borderBottomWidth: 2}}>
        {subAccount[0]['ACCOUNT_ID'] === '' ? (
          <View style={AccountsStyles.noData}>
            <Text>No Data Available</Text>
          </View>
        ) : (
          <Fragment>
            <View>
              <Text style={{...Styles.text, color: activeColor.text1}}>
                Total - {subAccount[0].SYMBOL} {amountSum}
              </Text>
            </View>
            <PieChart
              data={subAccount}
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
          </Fragment>
        )}
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={subAccount}
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
                  {Math.round((item.AMOUNT * 100) / amountSum) || '0'}%
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
                    navigation.navigate('FilterTransactionsByAccount', {
                      account: item.ACCOUNT_NAME,
                      id: item.ACCOUNT_ID,
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

export default SubStats;
