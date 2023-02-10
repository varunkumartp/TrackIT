import {View, Text, Pressable} from 'react-native';
import React, {useContext} from 'react';
import {Styles} from '../../globals/Styles.Styles';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';

interface MonthFilterProp {
  date: {
    month: number;
    year: number;
  };
  setDate: React.Dispatch<
    React.SetStateAction<{
      month: number;
      year: number;
    }>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MonthFilter = ({date, setDate, setLoading}: MonthFilterProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const addhandler = () => {
    setLoading(true);
    setDate({
      month: date.month - 1 === 0 ? 12 : date.month - 1,
      year: date.month - 1 === 0 ? date.year - 1 : date.year,
    });
  };

  const subtractHandler = () => {
    setLoading(true);
    setDate({
      month: date.month + 1 === 13 ? 1 : date.month + 1,
      year: date.month + 1 === 13 ? date.year + 1 : date.year,
    });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: activeColor.background,
        backgroundColor: activeColor.theme,
      }}>
      <Pressable onPress={() => addhandler()}>
        <Text style={{...Styles.text, color: activeColor.text}}>&#10094;</Text>
      </Pressable>
      <Text style={{...Styles.text, color: activeColor.text}}>
        {months[date.month - 1]} {date.year}
      </Text>
      <Pressable onPress={() => subtractHandler()}>
        <Text style={{...Styles.text, color: activeColor.text}}>&#10095;</Text>
      </Pressable>
    </View>
  );
};

export default MonthFilter;
