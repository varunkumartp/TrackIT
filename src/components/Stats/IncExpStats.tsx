import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getIncExpInvData } from '../../database/stats';
import { DateFilter } from '../../globals/DateFilter.component';
import { Styles } from '../../globals/Styles.Styles';
import { Theme } from '../../globals/Theme';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IncExpStats = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  const [inc, setInc] = useState<IncExp>({
    datasets: [{data: []}],
    labels: [],
  });
  const [exp, setExp] = useState<IncExp>({
    datasets: [{data: []}],
    labels: [],
  });

  const [date, setDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const chartConfig = {
    backgroundGradientFrom: activeColor.theme,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: activeColor.theme,
    backgroundGradientToOpacity: 1,
    color: () => activeColor.text1,
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeWidth: 0.5,
      stroke: activeColor.text2,
      strokeDasharray: '5',
    },
  };

  const CustomBarChart = ({
    data,
    header,
    color,
  }: {
    data: IncExp;
    header: string;
    color: string;
  }) => {
    return (
      <View style={IncExpStyles.barChartView}>
        <BarChart
          data={data}
          width={screenWidth}
          style={{
            ...IncExpStyles.barChartStyle,
            borderColor: activeColor.text1,
          }}
          height={screenHeight / 2.5}
          yAxisLabel="₹ "
          yAxisSuffix=""
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: color,
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
        />
        <Text
          style={{
            ...IncExpStyles.text,
            color: activeColor.text1,
          }}>
          {header}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    getIncExpInvData(date, setInc, setExp);
  }, [date]);
  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View
        style={{
          ...IncExpStyles.topBar,
          backgroundColor: activeColor.theme,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{...Styles.text, color: activeColor.text1}}>
            Total Stats
          </Text>
        </View>
        <View>
          <DateFilter date={date} setDate={setDate} value={'Periodic'} />
        </View>
      </View>
      <View style={{flex: 1}}>
        <CustomBarChart data={exp} header="Expenses" color={activeColor.red} />
        <CustomBarChart data={inc} header="Income" color={activeColor.blue} />
      </View>
    </View>
  );
};

const IncExpStyles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  barChartView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  barChartStyle: {
    alignItems: 'center',
    borderWidth: 2,
  },
  text: {
    textAlign: 'center',
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
  },
});

export default IncExpStats;
