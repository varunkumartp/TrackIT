import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useContext, useState} from 'react';
import {Styles} from './Styles.Styles';
import {ThemeContext} from '../contexts/ThemeContext';
import {Theme} from './Theme';
import {Dropdown} from 'react-native-element-dropdown';

interface DateFilterProp {
  date: DateFilter;
  value: string;
  setDate: React.Dispatch<React.SetStateAction<DateFilter>>;
}

interface DateFilterDDProp extends DateFilterProp {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const getFiscalYear = ({year}: DateFilter) => {
  if (new Date().getMonth() < 3) {
    return 'FY' + (year - 1) + '-' + year;
  } else {
    return 'FY' + year + '-' + (year + 1);
  }
};

const data = [
  {label: 'Period ', value: 'Periodic'},
  {label: 'Annual ', value: 'yearly'},
  {label: 'Fiscal Year', value: 'FY'},
];

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DateFilter = ({date, value, setDate}: DateFilterProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  const addhandler = () => {
    if (value === 'Periodic') {
      setDate({
        month: date.month - 1 === 0 ? 12 : date.month - 1,
        year: date.month - 1 === 0 ? date.year - 1 : date.year,
      });
    } else if (value === 'FY') {
      setDate({
        month: -1,
        year: date.year - 1,
      });
    } else if (value === 'yearly') {
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
    } else if (value === 'FY') {
      setDate({
        month: -1,
        year: date.year + 1,
      });
    } else if (value === 'yearly') {
      setDate({
        month: 0,
        year: date.year + 1,
      });
    }
  };

  return (
    <View style={{flex: 3, flexDirection: 'row'}}>
      <Pressable onPress={() => addhandler()}>
        <Text style={{...Styles.text, color: activeColor.text1}}>&#10094;</Text>
      </Pressable>
      <Text style={{...Styles.text, color: activeColor.text1}}>
        {value === 'FY'
          ? getFiscalYear(date)
          : value === 'Periodic'
          ? `${months[date.month - 1]} ${date.year}`
          : date.year}
      </Text>
      <Pressable onPress={() => subtractHandler()}>
        <Text style={{...Styles.text, color: activeColor.text1}}>&#10095;</Text>
      </Pressable>
    </View>
  );
};

export const DateFilterDD = ({date, setDate, value, setValue}: DateFilterDDProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  const dropDownHandler = (type: string) => {
    if (type === 'Periodic') {
      setDate({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } else if (type === 'FY') {
      setDate({
        month: -1,
        year: date.year,
      });
    } else {
      setDate({
        month: 0,
        year: date.year,
      });
    }
    setValue(type);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: activeColor.background,
        backgroundColor: activeColor.theme,
      }}>
      <DateFilter date={date} setDate={setDate} value={value} />
      <View style={{flex: 2, justifyContent: 'center'}}>
        <Dropdown
          selectedTextStyle={{
            fontSize: 15,
            textAlign: 'right',
            fontWeight: 'bold',
            color: activeColor.text1,
          }}
          activeColor={activeColor.background}
          iconColor={activeColor.text1}
          itemTextStyle={{color: activeColor.text1}}
          containerStyle={{
            backgroundColor: activeColor.theme,
            borderColor: activeColor.theme,
          }}
          data={data}
          labelField="label"
          valueField="value"
          value={value}
          onChange={item => dropDownHandler(item.value)}
        />
      </View>
    </View>
  );
};
