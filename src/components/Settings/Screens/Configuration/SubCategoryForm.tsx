import {View, Text, Pressable, TextInput} from 'react-native';
import React, {useContext, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {FormStyles} from '../../../../globals/Form.Styles';
import {Theme} from '../../../../globals/Theme';
import {
  createSubCategories,
  updateCategories,
} from '../../../../database/configuration';

type SubCategoryFormProps = NativeStackScreenProps<
  ConfigStackParamList,
  'SubCategoryForm'
>;

const SubCategoryForm = ({route, navigation}: SubCategoryFormProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [subCategory, setSubCategory] = useState(route.params.name);

  const submitHandler = () => {
    if (route.params.name === '') {
      createSubCategories(subCategory, route.params.type, route.params.ID);
    } else {
      updateCategories(route.params.ID, subCategory);
    }
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View style={FormStyles.fields}>
        <Text style={{...FormStyles.text, flex: 1, color: activeColor.text1}}>
          Sub-Category Name
        </Text>
        <TextInput
          style={{
            ...FormStyles.input,
            flex: 1.5,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          autoFocus={true}
          value={subCategory}
          onChangeText={value => setSubCategory(value)}
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

export default SubCategoryForm;
