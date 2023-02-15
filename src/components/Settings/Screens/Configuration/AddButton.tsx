import {View, Pressable, StyleSheet} from 'react-native';
import React, {Fragment, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {Theme} from '../../../../globals/Theme';
import {ThemeContext} from '../../../../contexts/ThemeContext';

interface AddButtonProps {
  ID: string;
  type: string;
  path: 'CategoryForm' | 'SubCategoryForm';
  name: string;
}

const AddButton = ({ID, type, path, name}: AddButtonProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const navigation =
    useNavigation<NativeStackNavigationProp<ConfigStackParamList>>();

  return (
    <Fragment>
      <View
        style={{
          ...AddButtonStyles.viewStyle,
          backgroundColor: activeColor.text1,
        }}></View>
      <Pressable
        style={AddButtonStyles.button}
        onPress={() =>
          navigation.navigate(path, {ID: ID, type: type, name: name})
        }>
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
