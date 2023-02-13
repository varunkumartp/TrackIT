import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';
import DateFilter from './DateFilter';
import {Styles} from '../../globals/Styles.Styles';
import {subHeaderSum} from '../../database/stats';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type SubStatsProps = CompositeScreenProps<
  NativeStackScreenProps<StatsStackParamList, 'SubStats'>,
  NativeStackScreenProps<RootStackParamList>
>;

const SubStats = ({route, navigation}: SubStatsProps) => {
  const filterNavigation = useNavigation<NativeStackScreenProps<RootStackParamList>>();
  const {PARENT_ID, PARENT_NAME, type, value} = route.params;
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [date, setDate] = useState(route.params.date);
  const [subAccount, setSubAccount] = useState<AccountSum[]>([
    {ACCOUNT_ID: '', ACCOUNT_NAME: '', AMOUNT: 0, SYMBOL: '₹', color: 'white'},
  ]);
  const [amountSum, setAmountSum] = useState(0);

  useEffect(() => {
    subHeaderSum(date, PARENT_ID, type, setSubAccount, setAmountSum);
  }, [date]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: activeColor.background,
          backgroundColor: activeColor.theme,
        }}>
        <View>
          <Text style={{...Styles.text, color: activeColor.text}}>{PARENT_NAME} </Text>
        </View>
        <View>
          <DateFilter date={date} setDate={setDate} value={value} />
        </View>
      </View>
      <View style={{borderBottomColor: activeColor.theme, borderBottomWidth: 2}}>
        {subAccount[0]['ACCOUNT_ID'] === '' ? (
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
          <Fragment>
            <View>
              <Text style={{...Styles.text, color: activeColor.text}}>
                Total - {subAccount[0].SYMBOL} {amountSum}
              </Text>
            </View>
            <PieChart
              data={subAccount}
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
                borderBottomWidth: 2,
                backgroundColor: activeColor.background,
                borderBottomColor: activeColor.text,
              }}>
              <Text
                style={{
                  ...AccountsStyles.text,
                  color: activeColor.text,
                }}>
                <Icon name={'circle'} color={item.color} size={15} />
                {'  '}
                <Text>{Math.round((item.AMOUNT * 100) / amountSum) || '0'}%</Text>
                {'  '}
                {item.ACCOUNT_NAME}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...AccountsStyles.text,
                    color: activeColor.text,
                  }}>
                  {item.SYMBOL} {item.AMOUNT}
                </Text>
                <TouchableOpacity
                  style={{...AccountsStyles.text, alignItems: 'center'}}
                  onPressOut={() =>
                    navigation.navigate('FilteredTransactions', {
                      account: item.ACCOUNT_NAME,
                      id: item.ACCOUNT_ID,
                    })
                  }>
                  <Icon name={'chevron-right'} size={15} color={activeColor.text} />
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

export default SubStats;