import {View, Pressable, StyleSheet} from 'react-native';
import React, {Fragment, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {Theme} from '../../globals/Theme';
import {ThemeContext} from '../../contexts/ThemeContext';

const AddButton = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const emptyData = {
    ID: '',
    DATE: '',
    DESCRIPTION: '',
    DEBIT_ID: '',
    CREDIT_ID: '',
    DEBIT_NAME: '',
    CREDIT_NAME: '',
    DEBIT_DIR: 0,
    CREDIT_DIR: 0,
    DEBIT_PARENT: '',
    CREDIT_PARENT: '',
    TYPE: 'EXPENSE',
    SYMBOL: '',
    AMOUNT_LOC: 0,
  };
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Fragment>
      <View
        style={{
          ...AddButtonStyles.viewStyle,
          backgroundColor: activeColor.text,
        }}></View>
      <Pressable
        style={AddButtonStyles.button}
        onPress={() => navigation.navigate('Form', {data: emptyData})}>
        <Icon name={'add-circle-sharp'} size={75} color={activeColor.theme} />
      </Pressable>
    </Fragment>
  );
};

const AddButtonStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    zIndex: 15,
    bottom: 5,
    right: 5,
    borderRadius: 100,
  },
  viewStyle: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    height: 40,
    width: 40,
    zIndex: 10,
  },
});

export default AddButton;
