import { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Theme } from '../Theme';

interface ButtonProps {
  onPress: () => void;
  text: string;
  size?: string;
  theme?: string;
}

const Button = ({onPress, text}: ButtonProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{backgroundColor: activeColor.background}}>
      <Text style={{color: activeColor.text1, fontSize: 24}}>{text}</Text>
    </TouchableOpacity>
  );
};
export default Button;
