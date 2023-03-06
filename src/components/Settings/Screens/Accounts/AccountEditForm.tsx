import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { createRef, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Modal, Pressable, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { editAccount, getAccountsGroup } from '../../../../database/accounts';
import { FormStyles } from '../../../../globals/Form.Styles';
import { Styles } from '../../../../globals/Styles.Styles';
import { Theme } from '../../../../globals/Theme';

type AccountEditFormProps = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'AccountEditForm'>,
  NativeStackScreenProps<SettingsStackParamList>
>;

const AccountEditForm = ({route, navigation}: AccountEditFormProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const {ID, NAME, PARENT_NAME} = route.params.data;
  const [modal, setModal] = useState(false);
  const [account, setAccount] = useState<{
    ID: string;
    GROUP: string;
    NAME: string;
    NUMBER: number;
  }>({
    ID: '',
    GROUP: PARENT_NAME,
    NAME: NAME,
    NUMBER: 0,
  });
  const [accountsGroup, setAccountsGroup] = useState<Accounts[]>([]);

  const groupRef = createRef<TextInput>();

  useEffect(() => {
    if (modal) {
      getAccountsGroup(setAccountsGroup);
    }
  }, [modal]);

  const groupHandler = ({ID, NAME, NUMBER}: Accounts) => {
    setModal(false);
    setAccount({...account, NUMBER: NUMBER, ID: ID, GROUP: NAME});
  };

  const submitHandler = () => {
    editAccount(account, ID);
    navigation.goBack();
  };

  return (
    <View style={{flex: 1, backgroundColor: activeColor.background}}>
      <View style={FormStyles.fields}>
        <Text style={{...FormStyles.text, color: activeColor.text1}}>
          Account Name
        </Text>
        <TextInput
          style={{
            ...FormStyles.input,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          value={account.NAME}
          onSubmitEditing={() => groupRef.current?.focus()}
          onChangeText={value => setAccount({...account, NAME: value})}
        />
      </View>
      <View style={FormStyles.fields}>
        <Text style={{...FormStyles.text, color: activeColor.text1}}>
          Account Group
        </Text>
        <TextInput
          ref={groupRef}
          style={{
            ...FormStyles.input,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          showSoftInputOnFocus={false}
          value={account.GROUP}
          onPressIn={() => setModal(true)}
          onFocus={() => setModal(true)}
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
            Update
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

      <Modal visible={modal} transparent={true}>
        <View
          style={{
            ...AccountEditFormStyles.modal,
            backgroundColor: activeColor.background,
            borderColor: activeColor.theme,
          }}>
          <View
            style={{
              backgroundColor: activeColor.theme,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{...Styles.text, color: activeColor.text1}}>
              Accounts
            </Text>
            <Pressable onPress={() => setModal(false)}>
              <Icon
                name="window-close"
                style={{...Styles.text, color: activeColor.text1}}
              />
            </Pressable>
          </View>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={accountsGroup}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => groupHandler(item)}>
                <Text style={{...Styles.text, color: activeColor.text1}}>
                  {item.NAME}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default AccountEditForm;

const AccountEditFormStyles = StyleSheet.create({
  modal: {
    marginVertical: 150,
    marginHorizontal: 75,
    padding: 0,
    borderWidth: 2,
  },
});
