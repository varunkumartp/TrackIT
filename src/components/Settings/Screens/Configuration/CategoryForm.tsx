import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import {
  createCategories,
  updateCategories
} from '../../../../database/configuration';
import { FormStyles } from '../../../../globals/Form.Styles';
import { Theme } from '../../../../globals/Theme';

type CategoryFormProps = NativeStackScreenProps<
  ConfigStackParamList,
  'CategoryForm'
>;

const CategoryForm = ({route, navigation}: CategoryFormProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [category, setCategory] = useState(route.params.name);

  const submitHandler = () => {
    if (route.params.name === '') {
      createCategories(category, route.params.type);
    } else {
      updateCategories(route.params.ID, category);
    }
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View style={FormStyles.fields}>
        <Text style={{...FormStyles.text, color: activeColor.text1}}>
          Category Name
        </Text>
        <TextInput
          style={{
            ...FormStyles.input,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          autoFocus={true}
          value={category}
          onChangeText={value => setCategory(value)}
        />
      </View>
      <View style={FormStyles.buttonField}>
        <Pressable
          style={{
            ...FormStyles.pressable,
            backgroundColor: activeColor.theme,
          }}
          onPress={() => submitHandler()}>
          <Text style={{...FormStyles.buttonText, color: activeColor.text1}}>
            {route.params.name === '' ? 'Submit' : 'Update'}
          </Text>
        </Pressable>
        <Pressable
          style={{
            ...FormStyles.pressable,
            backgroundColor: activeColor.theme,
          }}
          onPress={() => navigation.goBack()}>
          <Text style={{...FormStyles.buttonText, color: activeColor.text1}}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CategoryForm;
