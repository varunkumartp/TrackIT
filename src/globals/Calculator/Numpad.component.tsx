import React, { useContext, useState } from 'react';
import {
  Pressable, Text, TouchableHighlight, View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ListStyles } from '../List.Styles';
import { Theme } from '../Theme';

interface NumpadProps {
  setModal: () => void;
  setNumber: React.Dispatch<React.SetStateAction<string>>;
}

interface Buttons {
  value?: string;
  symbol?: string;
  buttonHandler: () => void;
}

interface CalculatorProp {
  currentValue: string;
  previousValue: string;
}

const initialState: CalculatorProp = {
  currentValue: '0',
  previousValue: '',
};

const Buttons = ({value, symbol, buttonHandler}: Buttons) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <TouchableHighlight
      underlayColor={activeColor.theme}
      style={{
        flex: 1,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: activeColor.theme,
      }}
      onPress={() => buttonHandler()}>
      {symbol === undefined ? (
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: activeColor.text1,
          }}>
          {value}
        </Text>
      ) : (
        <Icon
          name={symbol}
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: activeColor.text1,
          }}
        />
      )}
    </TouchableHighlight>
  );
};

const numbers = [
  ['1', '4', '7', '00'],
  ['2', '5', '8', '0'],
  ['3', '6', '9', '.'],
];

function evil(fn: string) {
  return new Function('return ' + fn)();
}

const Numpad = ({setModal, setNumber}: NumpadProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [state, setState] = useState<CalculatorProp>(initialState);
  const handleType = (type: string, value: string) => {
    switch (type) {
      case 'number':
        if (state.currentValue.includes('.') && value == '.') {
          setState(state);
        } else {
          setState(prev => ({
            ...prev,
            currentValue: `${prev.currentValue}${value}`,
          }));
          setNumber(prev => prev + value);
        }
        break;
      case 'operator':
        setState(prev => ({
          previousValue: prev.currentValue,
          currentValue: value,
        }));
        setNumber(prev => prev + value);
        break;
      case 'backspace':
        if (state.currentValue.slice(-1).includes('+' || '-' || '*' || '/')) {
          setState(prev => ({
            previousValue: '0',
            currentValue: prev.previousValue.slice(0, -1),
          }));
        }
        setNumber(prev => prev.slice(0, -1));
        break;
      case 'equal':
        setState(initialState);
        setNumber(prev => {
          if (prev === '') {
            return '';
          } else {
            return Math.abs(evil(prev)) === Infinity || evil(prev) === -Infinity
              ? '0'
              : evil(prev).toString();
          }
        });
        break;
      case 'done':
        setState(initialState);
        setNumber(prev => {
          if (prev === '') {
            return '';
          } else {
            return Math.abs(evil(prev)) === Infinity || evil(prev) === -Infinity
              ? '0'
              : evil(prev).toString();
          }
        });
        setModal();
        break;
      case 'clear':
        setNumber('');
    }
  };

  return (
    <View
      style={{
        ...ListStyles.container,
        backgroundColor: activeColor.background,
        borderColor: activeColor.theme,
      }}>
      <View style={{...ListStyles.header, backgroundColor: activeColor.theme}}>
        <Text style={{...ListStyles.headerText, color: activeColor.text1}}>
          Amount
        </Text>
        <View
          style={{...ListStyles.header, backgroundColor: activeColor.theme}}>
          <Pressable onPress={() => console.log('Editing')}>
            <Icon
              name="globe"
              style={{...ListStyles.headerText, color: activeColor.text1}}
            />
          </Pressable>
          <Pressable onPress={() => setModal()}>
            <Icon
              name="window-close"
              style={{...ListStyles.headerText, color: activeColor.text1}}
            />
          </Pressable>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        {numbers.map(el => (
          <View
            key={numbers.indexOf(el)}
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            {el.map(num => (
              <Buttons
                key={num}
                value={num}
                buttonHandler={() => handleType('number', num)}
              />
            ))}
          </View>
        ))}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Buttons
            symbol={'plus'}
            buttonHandler={() => handleType('operator', '+')}
          />
          <Buttons
            symbol={'minus'}
            buttonHandler={() => handleType('operator', '-')}
          />
          <Buttons
            value={'X'}
            buttonHandler={() => handleType('operator', '*')}
          />
          <Buttons
            symbol={'divide'}
            buttonHandler={() => handleType('operator', '/')}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Buttons
            symbol={'backspace'}
            buttonHandler={() => handleType('backspace', '')}
          />
          <Buttons value={'C'} buttonHandler={() => handleType('clear', '')} />
          <Buttons
            symbol={'equals'}
            buttonHandler={() => handleType('equal', '=')}
          />
          <Buttons
            value={'Done'}
            buttonHandler={() => handleType('done', '')}
          />
        </View>
      </View>
    </View>
  );
};

export default Numpad;
