import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Theme} from '../../../../globals/Theme';
import {RadioButton} from 'react-native-paper';
import {Styles} from '../../../../globals/Styles.Styles';
const Styling = () => {
  const {theme, updateTheme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const colors = Object.keys(Theme);
  const darkColors = colors.slice(0, colors.length / 2);
  const lightColors = colors.slice(colors.length / 2);

  const RenderItem = ({color}: {color: string}) => {
    return (
      <View
        style={{
          ...StylingStyles.container,
          borderColor: activeColor.text1,
          backgroundColor: Theme[color].theme,
        }}>
        <View style={StylingStyles.radioButtonContainer}>
          <RadioButton value={color} color={activeColor.text1} />
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        ...Styles.container,
        backgroundColor: activeColor.background,
      }}>
      <RadioButton.Group
        onValueChange={newValue => updateTheme({mode: newValue})}
        value={theme.mode}>
        <View style={StylingStyles.colorContainer}>
          <Text style={{...Styles.text, color: activeColor.text1}}>
            Dark Mode
          </Text>
          <Text style={{...Styles.text, color: activeColor.text1}}>
            Light Mode
          </Text>
        </View>
        <FlatList
          data={[...Array(colors.length / 2).keys()]}
          keyExtractor={item => item.toString()}
          renderItem={({index}) => (
            <View style={StylingStyles.colorContainer}>
              <RenderItem color={darkColors[index]} key={darkColors[index]} />
              <RenderItem color={lightColors[index]} key={lightColors[index]} />
            </View>
          )}
        />
      </RadioButton.Group>
    </View>
  );
};

const StylingStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderWidth: 2,
    borderRadius: 25,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
    flex: 1,
  },
  radioButtonContainer: {
    justifyContent: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Styling;
