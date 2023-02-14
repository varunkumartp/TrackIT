import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Theme} from '../../../../globals/Theme';
import {RadioButton} from 'react-native-paper';
import {Styles} from '../../../../globals/Styles.Styles';
const Styling = () => {
  const {theme, updateTheme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View style={{...Styles.container, backgroundColor: activeColor.background}}>
      <Text style={{...Styles.text, color: activeColor.text1}}>Select App Theme</Text>
      <RadioButton.Group
        onValueChange={newValue => updateTheme({mode: newValue})}
        value={theme.mode}>
        {Object.keys(Theme).map(el => (
          <View
            key={el}
            style={{
              ...StylingStyles.container,
              borderColor: Theme[el].text1,
              backgroundColor: Theme[el].theme,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 0.1,
              }}>
              <Icon name={'circle'} color={Theme[el].background} size={15} />
            </View>
            <View style={{flex: 0.9}}>
              <Text style={{...Styles.text, color: Theme[el].text1}}>{el}</Text>
            </View>
            <View style={StylingStyles.radioButtonContainer}>
              <RadioButton value={el} color={activeColor.text1} />
            </View>
          </View>
        ))}
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

export default Styling;
