import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { Styles } from '../../../../globals/Styles.Styles';
import { Theme } from '../../../../globals/Theme';

const NUMBERS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
interface LockScreenProps {
  header: string;
  pswd?: string;
  close?: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  changeHandler: (pswd: string) => void;
}

const LockScreen = ({
  header,
  pswd,
  close = false,
  setModal,
  changeHandler,
}: LockScreenProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [passcode, setPasscode] = useState('');

  const numberHandler = (number: number) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + number);
    }
  };

  const backSpaceHandler = () => {
    setPasscode(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    if (passcode.length === 4) {
      if (pswd !== undefined) {
        if (pswd !== passcode) {
          Alert.alert(
            'Password does not match',
            'Please re-enter the correct password',
          );
          setPasscode('');
        } else {
          setTimeout(() => changeHandler(passcode), 100);
        }
      } else {
        setTimeout(() => changeHandler(passcode), 100);
      }
    }
  }, [passcode]);

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View style={LockScreenStyles.logo}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{...LockScreenStyles.logoText, color: activeColor.text1}}>
            Track
            <Text
              style={{
                color: activeColor.theme,
              }}>
              IT
            </Text>
          </Text>
        </View>
        <Text style={{...Styles.text, color: activeColor.text1}}>{header}</Text>
      </View>
      <View style={LockScreenStyles.content}>
        <View style={LockScreenStyles.input}>
          {Array.from(Array(4).keys()).map(el => (
            <FontAwesome
              key={el}
              name={passcode.length < el + 1 ? 'circle-o' : 'circle'}
              size={25}
              color={activeColor.text1}
            />
          ))}
        </View>
        <View style={LockScreenStyles.column}>
          {NUMBERS.map(el => (
            <View style={LockScreenStyles.row} key={el.join()}>
              {el.map(num => (
                <TouchableHighlight
                  underlayColor={activeColor.theme}
                  key={num}
                  style={LockScreenStyles.touchable}
                  onPress={() => numberHandler(num)}>
                  <Text
                    style={{
                      ...LockScreenStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    {num}
                  </Text>
                </TouchableHighlight>
              ))}
            </View>
          ))}

          <View style={LockScreenStyles.row}>
            <TouchableHighlight
              underlayColor={activeColor.theme}
              style={LockScreenStyles.touchable}
              onPress={() => setModal(false)}
              disabled={close}>
              <Text
                style={{
                  ...LockScreenStyles.touchableText,
                  color: activeColor[close ? 'background' : 'text1'],
                }}>
                X
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={activeColor.theme}
              style={LockScreenStyles.touchable}
              onPress={() => numberHandler(0)}>
              <Text
                style={{
                  ...LockScreenStyles.touchableText,
                  color: activeColor.text1,
                }}>
                0
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={activeColor.theme}
              style={{...LockScreenStyles.touchable, justifyContent: 'center'}}
              onPress={() => backSpaceHandler()}>
              <Text
                style={{
                  ...LockScreenStyles.touchableText,
                  color: activeColor.text1,
                }}>
                <FontAwesome5 name="backspace" size={15} />
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </View>
  );
};

const LockScreenStyles = StyleSheet.create({
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 75,
  },
  input: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  content: {
    flex: 3,
  },
  touchableText: {
    fontSize: 29,
    margin: 10,
    fontWeight: 'bold',
  },
  touchable: {
    padding: 25,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 4,
    padding: 25,
    flexDirection: 'column',
  },
});

export default LockScreen;
