import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Theme } from '../../globals/Theme';

export const AccountItem = ({data}: {data: AccountsGroup}) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View
      style={{
        ...AccountsStyles.account,
        backgroundColor:
          activeColor[data.NUMBER % 1000 === 0 ? 'theme' : 'background'],
      }}>
      <Text
        style={{
          ...AccountsStyles.text,
          color: activeColor.text1,
          fontSize: data.NUMBER % 1000 === 0 ? 15 : 12,
        }}>
        {data.NAME}
      </Text>
      <Text
        style={{
          ...AccountsStyles.text,
          color:activeColor.text1,
          fontSize: data.NUMBER % 1000 === 0 ? 15 : 12,
        }}>
        {data.AMOUNT}
      </Text>
    </View>
  );
};

const AccountsStyles = StyleSheet.create({
  account: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginVertical: 10,
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
});
