import {useContext} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../contexts/ThemeContext';
import {Theme} from '../Theme';

interface ButtonProps {
  onPress: () => void;
  text: string;
  size?: string;
  theme?: string;
}

const screen = Dimensions.get('window');
const buttonWidth = screen.width / 4;

const Button = ({onPress, text}: ButtonProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor: activeColor.background}}>
      <Text style={{color: activeColor.text, fontSize: 24}}>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button;
