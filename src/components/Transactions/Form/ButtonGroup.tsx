import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';

interface ButtonGroupProps {
  data: {key: string; value: string}[];
  defaultKey: string;
  typeHandler: (type: string) => void;
}

const ButtonGroup = ({data, defaultKey, typeHandler}: ButtonGroupProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [type, setType] = useState(defaultKey);

  return (
    <View
      style={{
        ...ButtonGroupStyles.container,
        backgroundColor: activeColor.theme,
      }}>
      {data.map(el => (
        <Pressable
          key={el.key}
          style={{
            ...ButtonGroupStyles.pressable,
            backgroundColor: activeColor[type !== el.key ? 'theme' : 'text'],
          }}
          onPress={() => {
            setType(el.key);
            typeHandler(el.key);
          }}>
          <Text
            style={{
              ...ButtonGroupStyles.pressableText,
              color: activeColor[type === el.key ? 'theme' : 'background'],
            }}>
            {el.value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ButtonGroup;

const ButtonGroupStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 20,
  },
  pressable: {
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  pressableText: {
    margin: 10,
    fontSize: 15,
  },
});
