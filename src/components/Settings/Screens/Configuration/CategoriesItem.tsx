import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { AccountsStyles } from '../../../../globals/Accounts.Styles';
import { Theme } from '../../../../globals/Theme';

interface CategoriesItemProp {
  data: Accounts;
  type: string;
  formhandler: (ID: string, name: string) => void;
  categoryHandler: (ID: string, name: string) => void;
  check: (ID: string) => void;
}

const CategoriesItem = ({
  data,
  formhandler,
  categoryHandler,
  check,
}: CategoriesItemProp) => {

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
