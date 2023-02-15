import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {Styles} from '../../../../globals/Styles.Styles';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
      {/* <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => console.log('Nice')}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Main Currency
        </Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          ...ConfigStyle.touchableView,
          borderBottomColor: activeColor.text1,
        }}
        underlayColor={activeColor.theme}
        onPress={() => console.log('Nice')}>
        <Text style={{...ConfigStyle.text, color: activeColor.text1}}>
          Sub Currency
        </Text>
      </TouchableHighlight> */}
    </View>
  );
};

const ConfigStyle = StyleSheet.create({
  touchableView: {
    padding: 5,
    borderBottomWidth: 1,
  },
  text: {
    ...Styles.text,
    fontSize: 15,
  },
});

export default Configuration;
