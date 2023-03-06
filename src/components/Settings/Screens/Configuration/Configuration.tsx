import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { ConfigStyle } from '../../../../globals/Config.Styles';
import { Theme } from '../../../../globals/Theme';

type ConfigurationProp = NativeStackScreenProps<
  ConfigStackParamList,
  'Configuration'
>;

const Configuration = ({navigation}: ConfigurationProp) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => navigation.navigate('Categories', {type: 'Expense'})}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Expense Categories
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => navigation.navigate('Categories', {type: 'Income'})}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Income Categories
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => navigation.navigate('Categories', {type: 'Tax'})}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Tax Categories
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => navigation.navigate('Categories', {type: 'Other'})}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Other Expense Categories
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => navigation.navigate('DefaultCurrency')}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Default Currency
        </Text>
      </TouchableHighlight>
    </View>
  );
};


export default Configuration;
