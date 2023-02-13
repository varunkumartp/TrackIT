import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import {getAccounts, getSubAccounts} from '../../../database/accounts';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        <Text style={{...ListStyles.headerText, color: activeColor.text}}>{header}</Text>
        <View style={{...ListStyles.header, backgroundColor: activeColor.theme}}>
          <Pressable onPress={() => console.log('Editing')}>
            <Icon name="pencil" style={{...ListStyles.headerText, color: activeColor.text}} />
          </Pressable>
          <Pressable onPress={() => setModal(false)}>
            <Icon name="close" style={{...ListStyles.headerText, color: activeColor.text}} />
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
                backgroundColor: item.ID === selected ? activeColor.text : activeColor.background,
              }}>
              <Text
                style={{
                  ...ListStyles.text,
                  color: item.ID === selected ? activeColor.theme : activeColor.text,
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
              <Text style={{...ListStyles.text, color: activeColor.text}}>{item.NAME}</Text>
            </Pressable>
          )}
          keyExtractor={item => item.ID}
        />
      </View>
    </View>
  );
};

const ListStyles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    zIndex: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 15,
    margin: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 2,
  },
  text: {
    fontSize: 11,
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  options: {
    zIndex: 2,
    borderBottomColor: '#777',
    borderBottomWidth: 1,
  },
});

export default AccountsList;
