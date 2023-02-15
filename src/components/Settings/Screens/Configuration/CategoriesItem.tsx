import {View, Text, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AccountsStyles} from '../../../../globals/Accounts.Styles';

interface CategoriesItemProp {
  data: Accounts;
  type: string;
  formhandler: (ID: string, name: string) => void;
  categoryHandler: (ID: string, name: string) => void;
  check: (ID: string) => void;
}

const CategoriesItem = ({
  data,
  type,
  formhandler,
  categoryHandler,
  check,
}: CategoriesItemProp) => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<ConfigStackParamList, 'Categories'>
    >();

  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View
      style={{
        ...AccountsStyles.headerAccount,
        backgroundColor: activeColor.background,
        borderBottomColor: activeColor.text1,
      }}>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => categoryHandler(data.ID, data.NAME)}>
          <Text
            style={{
              ...AccountsStyles.text,
              color: activeColor.text1,
              fontSize: 15,
            }}>
            {data.NAME}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{padding: 10}} onPress={() => check(data.ID)}>
          <Icon name={'trash-alt'} size={20} color={activeColor.red} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => formhandler(data.ID, data.NAME)}>
          <Icon name={'pencil-alt'} size={20} color={activeColor.text1} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoriesItem;
