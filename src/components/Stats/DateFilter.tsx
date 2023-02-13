import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {Styles} from '../../globals/Styles.Styles';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../../globals/Theme';

interface DateFilterProp {
  date: {
    month: number;
    year: number;
  };
  value: string;
  setDate: React.Dispatch<
    React.SetStateAction<{
      month: number;
      year: number;
    }>
  >;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DateFilter = ({date, value, setDate}: DateFilterProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  const addhandler = () => {
    if (value === 'Periodic') {
      setDate({
        month: date.month - 1 === 0 ? 12 : date.month - 1,
        year: date.month - 1 === 0 ? date.year - 1 : date.year,
      });
    } else {
      setDate({
        month: 0,
        year: date.year - 1,
      });
    }
  };

  const subtractHandler = () => {
    if (value === 'Periodic') {
      setDate({
        month: date.month + 1 === 13 ? 1 : date.month + 1,
        year: date.month + 1 === 13 ? date.year + 1 : date.year,
      });
    } else {
      setDate({
        month: 0,
        year: date.year + 1,
      });
    }
  };

  return (
    <View style={{flex: 3, flexDirection: 'row'}}>
      <Pressable onPress={() => addhandler()}>
        <Text style={{...Styles.text, color: activeColor.text}}>&#10094;</Text>
      </Pressable>
      <Text style={{...Styles.text, color: activeColor.text}}>
        {value === 'Periodic' ? months[date.month - 1] : ''} {date.year}
      </Text>
      <Pressable onPress={() => subtractHandler()}>
        <Text style={{...Styles.text, color: activeColor.text}}>&#10095;</Text>
      </Pressable>
    </View>
  );
};

export default DateFilter;
