import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { Fragment, useContext, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import {
  deleteAccount,
  deleteAccountTransactions
} from '../../../../database/accounts';
import { AccountsStyles } from '../../../../globals/Accounts.Styles';
import ModalBox from '../../../../globals/ModalBox';
import { Theme } from '../../../../globals/Theme';

const CurrencyHeader = ({header}: {header: string}) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <View
      style={{
        ...AccountsStyles.headerAccount,
        backgroundColor: activeColor.theme,
      }}>
      <Text
        style={{
          ...AccountsStyles.headerText,
          color: activeColor.text1,
        }}>
        {header}
      </Text>
    </View>
  );
};

const CurrencyItem = ({
  data,
  setAccount,
}: {
  data: AccountsGroup;
  setAccount: React.Dispatch<React.SetStateAction<AccountsTab[]>>;
}) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [modal1, setModal1] = useState(false); // Modal with delete transactions
  const [modal2, setModal2] = useState(false); // Simple Yes No Modal
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<SettingsStackParamList, 'Accounts'>,
        NativeStackNavigationProp<RootStackParamList>
      >
    >();
  const editHandler = (data: AccountsGroup) => {
    navigation.navigate('AccountEditForm', {data: data});
  };

  return (
    <View
      style={{
        ...AccountsStyles.headerAccount,
        backgroundColor:
          activeColor[data.NUMBER % 1000 === 0 ? 'theme' : 'background'],
      }}>
      <Text
        style={{
          ...AccountsStyles.text,
          color: activeColor.text1,
          fontSize: data.NUMBER % 1000 === 0 ? 15 : 12,
        }}>
        {data.NAME}
      </Text>
      {data.NUMBER % 1000 !== 0 && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() =>
              data.AMOUNT !== 0 && data.AMOUNT !== null
                ? setModal1(true)
                : setModal2(true)
            }>
            <Icon name={'trash-alt'} size={20} color={activeColor.red} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => editHandler(data)}>
            <Icon name={'pencil-alt'} size={20} color={activeColor.text1} />
          </TouchableOpacity>
        </View>
      )}
      {/********************************** Modal 2 ******************************************************/}
      <ModalBox
        modal={modal2}
        setModal={setModal2}
        header="Delete Account"
        subHeading="Do you want to delete this account?"
        firstButton="Yes"
        secondButton="No"
        onConfirm={() => {
          setModal2(false);
          deleteAccount(data.ID, setAccount);
        }}
      />
      {/********************************** Modal 1 ******************************************************/}
      <ModalBox
        modal={modal1}
        setModal={setModal1}
        header="Delete Account"
        subHeading="This account contains transactions. What would you like to do with these transactions?"
        firstButton="Delete Transactions and Account"
        secondButton="Cancel"
        onConfirm={() => {
          deleteAccountTransactions(data.ID, setAccount);
          setModal1(false);
        }}
      />
    </View>
  );
};

interface AccountGroup extends AccountsTab {
  setAccounts: React.Dispatch<React.SetStateAction<AccountsTab[]>>;
}

export const AccountsGroup = ({data, title, setAccounts}: AccountGroup) => {
  return (
    <Fragment>
      <CurrencyHeader header={title} />
      <FlatList
        data={data}
        keyboardShouldPersistTaps={'handled'}
        keyExtractor={item => item.ID}
        renderItem={({item}) => (
          <CurrencyItem data={item} setAccount={setAccounts} />
        )}
      />
    </Fragment>
  );
};
