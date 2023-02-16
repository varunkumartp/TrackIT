import {View, Text, FlatList, Modal} from 'react-native';
import React, {Fragment, useContext, useState} from 'react';
import {ThemeContext} from '../../../../contexts/ThemeContext';
import {Theme} from '../../../../globals/Theme';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  deleteAccount,
  deleteAccountTransactions,
} from '../../../../database/accounts';
import {ModalStyles} from '../../../../globals/Modal.Styles';
import {AccountsStyles} from '../../../../globals/Accounts.Styles';

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
      <Modal transparent={true} visible={modal2}>
        <View style={ModalStyles.mainView}>
          <View
            style={{
              ...ModalStyles.modalView,
              borderColor: activeColor.text1,
            }}>
            <View
              style={{
                ...ModalStyles.modalHeader,
                borderBottomColor: activeColor.text1,

                backgroundColor: activeColor.theme,
              }}>
              <Text
                style={{
                  ...ModalStyles.modalHeaderText,
                  color: activeColor.text1,
                }}>
                Delete Account
              </Text>
            </View>
            <View
              style={{
                backgroundColor: activeColor.background,
                ...ModalStyles.modalContent,
              }}>
              <Text
                style={{
                  ...ModalStyles.modalContentText,
                  color: activeColor.text1,
                }}>
                Do you want to delete this account?
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => {
                    setModal2(false);
                    deleteAccount(data.ID, setAccount);
                  }}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal2(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/********************************** Modal 1 ******************************************************/}
      <Modal transparent={true} visible={modal1}>
        <View style={ModalStyles.mainView}>
          <View
            style={{
              ...ModalStyles.modalView,
              borderColor: activeColor.text1,
            }}>
            <View
              style={{
                ...ModalStyles.modalHeader,
                backgroundColor: activeColor.theme,
                borderBottomColor: activeColor.text1,
              }}>
              <Text
                style={{
                  ...ModalStyles.modalHeaderText,
                  color: activeColor.text1,
                }}>
                Delete Account
              </Text>
            </View>
            <View
              style={{
                backgroundColor: activeColor.background,
                ...ModalStyles.modalContent,
              }}>
              <Text
                style={{
                  ...ModalStyles.modalContentText,
                  color: activeColor.text1,
                }}>
                This account contains transactions. What would you like to do
                with these transactions?
              </Text>
              <View>
                {/* Feature for future release */}
                {/* <TouchableOpacity onPress={() => setModal1(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.secondary,
                    }}>
                    Move transactions to a different Account
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    deleteAccountTransactions(data.ID, setAccount);
                    setModal1(false);
                  }}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Delete Transactions and Account
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal1(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
