import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getAllAccounts } from '../../database/accounts';
import { AccountsStyles } from '../../globals/Accounts.Styles';
import { FormStyles } from '../../globals/Form.Styles';
import { ListStyles } from '../../globals/List.Styles';
import { ModalStyles } from '../../globals/Modal.Styles';
import { Styles } from '../../globals/Styles.Styles';
import { Theme } from '../../globals/Theme';
import ButtonGroup from './Form/ButtonGroup';

type FilterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'FilterScreen'
>;

const ButtonGroupData = [
  {key: 'INCOME', value: 'Income'},
  {key: 'EXPENSE', value: 'Expense'},
  {key: 'MAIN', value: 'Accounts'},
];

const FilterScreen = React.memo(({navigation}: FilterScreenProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [accounts, setAccounts] = useState<AccountsFilter[]>([]);
  const [type, setType] = useState('EXPENSE');
  const [selectAll, setSelectAll] = useState<{
    [key: string]: boolean;
  }>({
    EXPENSE: false,
    INCOME: false,
    MAIN: false,
  });
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState({
    min: '',
    max: '',
  });

  const selectAllHandler = () => {
    let tempArr = accounts.map(el =>
      el.TYPE === type ? {...el, isChecked: !selectAll[type]} : el,
    );
    setAccounts(tempArr);
    setSelectAll({...selectAll, [type]: !selectAll[type]});
  };

  const changeHandler = (item: AccountsFilter, checked: boolean) => {
    let tempArr = accounts.map(el =>
      el.ID === item.ID ? {...item, isChecked: checked} : el,
    );
    if (item.NUMBER % 1000 === 0) {
      tempArr = [
        ...tempArr.map(el =>
          el.PARENT_ID === item.ID ? {...el, isChecked: checked} : el,
        ),
      ];
    }
    setAccounts(tempArr);
  };

  const submitHandler = () => {
    if (accounts.filter(el => el.isChecked === true).length === 0) {
      setModal(true);
    } else {
      navigation.navigate('FilteredTransactions', {
        amount: amount,
        id: accounts
          .filter(el => el.isChecked === true)
          .map(el => `'${el.ID}'`),
      });
    }
  };

  useEffect(() => {
    getAllAccounts(setAccounts);
  }, []);

  return (
    <View
      style={{
        ...ListStyles.container,
        backgroundColor: activeColor.background,
        borderColor: activeColor.theme,
      }}>
      <View style={FormStyles.buttonField}>
        <Pressable
          onPress={submitHandler}
          style={{
            ...FormStyles.pressable,
            flex: 1,
            backgroundColor: activeColor.theme,
          }}>
          <Text style={{...FormStyles.buttonText, color: activeColor.text1}}>
            Apply Filter
          </Text>
        </Pressable>
      </View>
      <View style={{...FormStyles.fields}}>
        <Text style={{...Styles.text, color: activeColor.text1}}>
          Min. Amount
        </Text>
        <TextInput
          style={{
            ...FormStyles.input,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          keyboardType="number-pad"
          onChangeText={el => setAmount(prev => ({...prev, min: el}))}
        />
      </View>
      <View style={{...FormStyles.fields}}>
        <Text style={{...Styles.text, color: activeColor.text1}}>
          Max. Amount
        </Text>
        <TextInput
          style={{
            ...FormStyles.input,
            color: activeColor.text1,
            borderBottomColor: activeColor.text1,
          }}
          keyboardType="number-pad"
          onChangeText={el => setAmount(prev => ({...prev, max: el}))}
        />
      </View>
      <View
        style={{borderBottomWidth: 2, borderBottomColor: activeColor.theme}}>
        <ButtonGroup
          data={ButtonGroupData}
          defaultKey={'EXPENSE'}
          typeHandler={setType}
        />
      </View>
      <View
        style={{
          ...AccountsStyles.headerAccount,
          justifyContent: 'flex-start',
          backgroundColor: activeColor.theme,
        }}>
        <Checkbox
          status={selectAll[type] ? 'checked' : 'unchecked'}
          onPress={() => selectAllHandler()}
          color={activeColor.text1}
        />
        <Text
          style={{
            ...AccountsStyles.headerText,
            borderBottomWidth: 0,
            color: activeColor.text1,
          }}>
          Select All
        </Text>
      </View>
      <FlatList
        data={accounts.filter(el => el.TYPE === type)}
        keyExtractor={item => item.ID}
        renderItem={({item}) => (
          <View
            style={{
              ...AccountsStyles.headerAccount,
              borderBottomWidth: 0,
              borderTopWidth: 1,
              borderTopColor:
                activeColor[
                  item.NUMBER % 1000 === 0 || item.NUMBER % 1000 === 1
                    ? 'theme'
                    : 'text1'
                ],
              justifyContent: 'flex-start',
              backgroundColor:
                activeColor[item.NUMBER % 1000 === 0 ? 'theme' : 'background'],
            }}>
            <Checkbox
              status={
                (
                  item.NUMBER % 1000 === 0
                    ? accounts
                        .filter(el => el.PARENT_ID === item.ID)
                        .filter(el => el.isChecked !== true).length < 1 &&
                      item.isChecked
                    : item.isChecked
                )
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => changeHandler(item, !item.isChecked)}
              color={activeColor.text1}
            />
            <Text
              style={{
                ...AccountsStyles.headerText,
                color: activeColor.text1,
              }}>
              {item.NAME}
            </Text>
          </View>
        )}
      />
      <Modal transparent={true} visible={modal}>
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
                No filters applied
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
                Please select atleast one account or category
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableOpacity onPress={() => setModal(false)}>
                  <Text
                    style={{
                      ...ModalStyles.touchableText,
                      color: activeColor.text1,
                    }}>
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default FilterScreen;
