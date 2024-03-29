import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { getAccounts, getSubAccounts } from '../../../database/accounts';
import { ListStyles } from '../../../globals/List.Styles';
import { Theme } from '../../../globals/Theme';

interface AccountsListProps {
  type: string;
  header: string;
  onChange: (account: Accounts) => void;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountsList = ({type, header, onChange, setModal}: AccountsListProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [selected, setSelected] = useState<string>();
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [subAccounts, setSubAccounts] = useState<Accounts[]>([]);

  const accountHandler = (item: Accounts) => {
    setSelected(item.ID);
    getSubAccounts(setSubAccounts, type, item);
  };

  const subAccountHandler = (item: Accounts) => {
    onChange(item);
    setModal(false);
  };

  useEffect(() => {
    getAccounts(setAccounts, type);
    setSubAccounts([]);
  }, [type]);
  return (
    <View
      style={{
        ...ListStyles.container,
        backgroundColor: activeColor.background,
        borderColor: activeColor.theme,
      }}>
      <View style={{...ListStyles.header, backgroundColor: activeColor.theme}}>
        <Text style={{...ListStyles.headerText, color: activeColor.text1}}>{header}</Text>
        <View style={{...ListStyles.header, backgroundColor: activeColor.theme}}>
          <Pressable onPress={() => setModal(false)}>
            <Icon name="close" style={{...ListStyles.headerText, color: activeColor.text1}} />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          ...ListStyles.listContainer,
          borderTopColor: activeColor.theme,
        }}>
        <FlatList
          data={accounts}
          style={{
            borderRightColor: activeColor.theme,
            borderRightWidth: 2,
            flex: 1,
          }}
          renderItem={({item}) => (
            <Pressable
              onPress={() => accountHandler(item)}
              style={{
                ...ListStyles.options,
                backgroundColor: item.ID === selected ? activeColor.text1 : activeColor.background,
              }}>
              <Text
                style={{
                  ...ListStyles.text,
                  color: item.ID === selected ? activeColor.text2 : activeColor.text1,
                }}>
                {item.NAME}
              </Text>
            </Pressable>
          )}
          keyExtractor={item => item.ID}
        />
        <FlatList
          data={subAccounts}
          style={{
            borderRightColor: activeColor.theme,
            borderRightWidth: 2,
            flex: 1,
          }}
          renderItem={({item}) => (
            <Pressable onPress={() => subAccountHandler(item)} style={ListStyles.options}>
              <Text style={{...ListStyles.text, color: activeColor.text1}}>{item.NAME}</Text>
            </Pressable>
          )}
          keyExtractor={item => item.ID}
        />
      </View>
    </View>
  );
};


export default AccountsList;
