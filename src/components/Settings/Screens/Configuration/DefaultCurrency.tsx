import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {readCurrency} from '../../../../database/currency';
import {AccountsStyles} from '../../../../globals/Accounts.Styles';
import {RadioButton} from 'react-native-paper';
import {CurrencyContext} from '../../../../contexts/CurrencyContext';

const DefaultCurrency = () => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const {currency, updateCurrency} = useContext(CurrencyContext);
  let currValue = currency.mode;
  const [currencyList, setCurrencyList] = useState<readCurrency>([]);
  useEffect(() => {
    readCurrency(setCurrencyList);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: activeColor.background,
        borderTopColor: activeColor.background,
        borderTopWidth: 1,
      }}>
      <RadioButton.Group
        onValueChange={newValue => updateCurrency({mode: newValue})}
        value={currValue}>
        <FlatList
          data={currencyList}
          keyExtractor={item => item.title}
          renderItem={({item}) => (
            <Fragment>
              <View
                style={{
                  ...AccountsStyles.headerAccount,
                  backgroundColor: activeColor.theme,
                }}>
                <Text
                  style={{
                    ...AccountsStyles.headerText,
                    color: activeColor.text1,
                  }}>
                  {item.title}
                </Text>
              </View>
              <FlatList
                data={item.data}
                keyExtractor={item => item.KEY}
                renderItem={({item}) => (
                  <View
                    style={{
                      ...AccountsStyles.headerAccount,
                    }}>
                    <Text
                      style={{
                        ...AccountsStyles.text,
                        color: activeColor.text1,
                      }}>
                      {item.KEY} - {item.NAME} - {item.SYMBOL}
                    </Text>
                    <View style={StylingStyles.radioButtonContainer}>
                      <RadioButton value={item.KEY} color={activeColor.text1} />
                    </View>
                  </View>
                )}
              />
            </Fragment>
          )}
        />
      </RadioButton.Group>
    </View>
  );
};

const StylingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 25,
    marginHorizontal: 15,
    marginVertical: 2,
  },
  radioButtonContainer: {
    justifyContent: 'center',
  },
});

export default React.memo(DefaultCurrency);
