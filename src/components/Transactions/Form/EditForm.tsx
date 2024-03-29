import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { createRef, useContext, useState } from 'react';
import { Alert, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { CurrencyContext } from '../../../contexts/CurrencyContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import {
  deleteTransaction,
  editTransaction
} from '../../../database/transactions';
import Numpad from '../../../globals/Calculator/Numpad.component';
import { FormStyles } from '../../../globals/Form.Styles';
import { Theme } from '../../../globals/Theme';
import AccountsList from './AccountsList';
import ButtonGroup from './ButtonGroup';

type EditFormProps = NativeStackScreenProps<RootStackParamList, 'EditForm'>;

const EditForm = ({route, navigation}: EditFormProps) => {
  const {data} = route.params;
  const {theme} = useContext(ThemeContext);
  const {currency, updateCurrency} = useContext(CurrencyContext);
  let currValue = currency.mode;
  let activeColor = Theme[theme.mode];
  const [type, setType] = useState(data.TYPE);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [debitAccount, setDebitAccount] = useState<FormAccount>({
    ID: data.DEBIT_ID,
    NAME: data.DEBIT_NAME,
  });
  const [creditAccount, setCreditAccount] = useState<FormAccount>({
    ID: data.CREDIT_ID,
    NAME: data.CREDIT_NAME,
  });
  const [creditList, setCreditList] = useState(false);
  const [debitList, setDebitList] = useState(false);
  const [numpad, setNumpad] = useState(false);
  const [amount, setAmount] = useState(
    data.AMOUNT_LOC === 0 ? '' : data.AMOUNT_LOC.toString(),
  );
  const [input, setInput] = useState<inputData>({
    DATE: new Date(data.DATE),
    DESCRIPTION: data.DESCRIPTION,
    NOTES: data.NOTES,
  });
  const debitRef = createRef<TextInput>();
  const creditRef = createRef<TextInput>();
  const amountRef = createRef<TextInput>();
  const descriptionRef = createRef<TextInput>();

  const typeHandler = (newType: string) => {
    setEditMode(true);
    setType(newType);
    setCreditAccount({} as FormAccount);
  };

  const creditHandler = (account: Accounts) => {
    setCreditAccount({ID: account.ID, NAME: account.NAME});
    amountRef.current?.focus();
  };

  const debitHandler = (account: Accounts) => {
    setDebitAccount({ID: account.ID, NAME: account.NAME});
    creditRef.current?.focus();
  };

  const deleteHandler = () => {
    Alert.alert(
      'Delete Transaction',
      'Do you want to delete this transaction?',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => {
            deleteTransaction(data.ID);
            navigation.navigate('BottomTab');
          },
        },
      ],
    );
  };

  const edithandler = () => {
    editTransaction(data.ID, {
      ...input,
      AMOUNT_LOC: amount,
      DEBIT: type === 'EXPENSE' ? creditAccount.ID : debitAccount.ID,
      CREDIT: type === 'EXPENSE' ? debitAccount.ID : creditAccount.ID,
      TYPE: type,
      CURR_LOC: currValue,
    });
    navigation.navigate('BottomTab');
  };

  return (
    <View
      style={{
        ...FormStyles.parentContainer,
        backgroundColor: activeColor.background,
      }}>
      <ButtonGroup
        data={[
          {key: 'INCOME', value: 'Income'},
          {key: 'EXPENSE', value: 'Expense'},
          {key: 'MAIN', value: 'Journal Entry'},
        ]}
        defaultKey={data.TYPE}
        typeHandler={typeHandler}
      />
      <View
        style={{
          ...FormStyles.container,
          backgroundColor: activeColor.background,
        }}>
        <DatePicker
          modal
          open={open}
          mode={'date'}
          date={input.DATE}
          onConfirm={date => {
            setOpen(false);
            setInput({...input, DATE: date});
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <View style={FormStyles.parentContainer}>
          {/* Date */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              Date
            </Text>
            <TextInput
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              onPressIn={() => {
                setEditMode(true);
                setOpen(true);
                setDebitList(false);
                setCreditList(false);
                setNumpad(false);
              }}
              value={input.DATE.toLocaleDateString()}
              showSoftInputOnFocus={false}
              onContentSizeChange={() => editMode && debitRef.current?.focus()}
            />
          </View>
          {/* Debit Account */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              {type === 'EXPENSE' || type === 'INCOME'
                ? 'Account'
                : 'Debit Account'}
            </Text>
            <TextInput
              ref={debitRef}
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              value={debitAccount.NAME}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                setEditMode(true);
                Keyboard.dismiss();
                setNumpad(false);
                setCreditList(false);
                setDebitList(true);
              }}
              onFocus={() => {
                setDebitList(true && editMode);
              }}
            />
          </View>
          {/* Credit Account */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              {type === 'EXPENSE' || type === 'INCOME'
                ? 'Category'
                : 'Credit Account'}
            </Text>
            <TextInput
              ref={creditRef}
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              value={creditAccount.NAME}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                setEditMode(true);
                Keyboard.dismiss();
                setNumpad(false);
                setCreditList(true);
                setDebitList(false);
              }}
              onFocus={() => {
                setCreditList(true && editMode);
              }}
            />
          </View>
          {/* Amount */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              Amount
            </Text>
            <TextInput
              ref={amountRef}
              value={amount}
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                setEditMode(true);
                setCreditList(false);
                setDebitList(false);
                setNumpad(true);
              }}
              onFocus={() => {
                setNumpad(true);
              }}
            />
          </View>
          {/* Description */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              Description
            </Text>
            <TextInput
              ref={descriptionRef}
              value={input.DESCRIPTION}
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              onChangeText={value => setInput({...input, DESCRIPTION: value})}
              onPressIn={() => {
                setNumpad(false);
                setEditMode(true);
                setCreditList(false);
                setDebitList(false);
              }}
            />
          </View>
          {/* Notes */}
          <View style={{...FormStyles.fields}}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              Notes
            </Text>
            <TextInput
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              onChangeText={value => setInput({...input, NOTES: value})}
              onPressIn={() => {
                setNumpad(false);
                setEditMode(true);
                setCreditList(false);
                setDebitList(false);
              }}
              value={input.NOTES}
            />
          </View>
          {editMode && (
            <View style={FormStyles.buttonField}>
              <Pressable
                style={{
                  ...FormStyles.pressable,
                  backgroundColor: activeColor.theme,
                  flex: 2,
                }}
                onPress={() => edithandler()}>
                <Text
                  style={{...FormStyles.buttonText, color: activeColor.text1}}>
                  Update
                </Text>
              </Pressable>
              <Pressable
                style={{
                  ...FormStyles.pressable,
                  backgroundColor: activeColor.theme,
                  flex: 1,
                }}
                onPress={() => navigation.navigate('BottomTab')}>
                <Text
                  style={{...FormStyles.buttonText, color: activeColor.text1}}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          )}
          {!editMode && (
            <View style={FormStyles.buttonField}>
              <Pressable
                style={{
                  ...FormStyles.pressable,
                  backgroundColor: activeColor.theme,
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => navigation.navigate('Form', {data: data})}>
                <Icon name="clone" size={15} color={activeColor.text1} />
                <Text
                  style={{...FormStyles.buttonText, color: activeColor.text1}}>
                  Copy
                </Text>
              </Pressable>
              <Pressable
                style={{
                  ...FormStyles.pressable,
                  backgroundColor: activeColor.theme,
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
                onPress={() => deleteHandler()}>
                <Icon name="trash-alt" size={15} color={activeColor.text1} />
                <Text
                  style={{...FormStyles.buttonText, color: activeColor.text1}}>
                  Delete
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      {creditList && (
        <AccountsList
          type={type}
          header={type === 'MAIN' ? 'Accounts' : 'Categories'}
          onChange={account => creditHandler(account)}
          setModal={setCreditList}
        />
      )}
      {debitList && (
        <AccountsList
          type="MAIN"
          header="Accounts"
          onChange={account => debitHandler(account)}
          setModal={setDebitList}
        />
      )}
      {numpad && (
        <Numpad
          setModal={() => {
            setNumpad(false);
            descriptionRef.current?.focus();
          }}
          setNumber={setAmount}
        />
      )}
    </View>
  );
};

export default EditForm;
