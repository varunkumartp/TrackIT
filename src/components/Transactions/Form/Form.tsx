import {View, Text, TextInput, Pressable, Keyboard} from 'react-native';
import React, {createRef, useContext, useState} from 'react';

import DatePicker from 'react-native-date-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ButtonGroup from './ButtonGroup';
import Numpad from '../../../globals/Calculator/Numpad.component';
import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import {FormStyles} from '../../../globals/Form.Styles';
import AccountsList from './AccountsList';
import {createTransactions} from '../../../database/transactions';
import {CurrencyContext} from '../../../contexts/CurrencyContext';

type FormProps = NativeStackScreenProps<RootStackParamList, 'Form'>;

const Form = ({route, navigation}: FormProps) => {
  const {data} = route.params;
  const {theme} = useContext(ThemeContext);
  const {currency, updateCurrency} = useContext(CurrencyContext);
  let currValue = currency.mode;
  let activeColor = Theme[theme.mode];
  const [type, setType] = useState(data.TYPE);
  const [open, setOpen] = useState(false);
  const [debitAccount, setDebitAccount] = useState<FormAccount>({
    ID: data.DEBIT_ID,
    NAME: data.DEBIT_NAME,
  });
  const [creditAccount, setCreditAccount] = useState<FormAccount>({
    ID: data.CREDIT_ID,
    NAME: data.CREDIT_NAME,
  });
  const [creditList, setCreditList] = useState(false);
  const [debitList, setDebitList] = useState(true);
  const [numpad, setNumpad] = useState(false);
  const [amount, setAmount] = useState(
    data.AMOUNT_LOC === 0 ? '' : data.AMOUNT_LOC.toString(),
  );
  const [input, setInput] = useState<inputData>({
    DATE: new Date(),
    DESCRIPTION: data.DESCRIPTION,
    NOTES: '',
  });
  const debitRef = createRef<TextInput>();
  const creditRef = createRef<TextInput>();
  const amountRef = createRef<TextInput>();
  const descriptionRef = createRef<TextInput>();

  const typeHandler = (newType: string) => {
    setType(newType);
    setCreditAccount({} as FormAccount);
  };

  const creditHandler = (account: Accounts) => {
    setCreditAccount(account);
    amountRef.current?.focus();
  };

  const debitHandler = (account: Accounts) => {
    setDebitAccount(account);
    creditRef.current?.focus();
  };

  const submitHandler = () => {
    createTransactions({
      ...input,
      AMOUNT_LOC: amount,
      DEBIT: type === 'EXPENSE' ? creditAccount.ID : debitAccount.ID,
      CREDIT: type === 'EXPENSE' ? debitAccount.ID : creditAccount.ID,
      TYPE: type,
      CURR_LOC:currValue
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
                setOpen(true);
                setDebitList(false);
                setCreditList(false);
                setNumpad(false);
              }}
              value={input.DATE.toLocaleDateString()}
              showSoftInputOnFocus={false}
              onContentSizeChange={() => debitRef.current?.focus()}
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
                Keyboard.dismiss();
                setNumpad(false);
                setCreditList(false);
                setDebitList(true);
              }}
              onFocus={() => {
                setDebitList(true);
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
                Keyboard.dismiss();
                setNumpad(false);
                setCreditList(true);
                setDebitList(false);
              }}
              onFocus={() => {
                setCreditList(true);
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
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                Keyboard.dismiss();
                setCreditList(false);
                setDebitList(false);
                setNumpad(true);
              }}
              onFocus={() => {
                setNumpad(true);
              }}
              value={amount}
            />
          </View>
          {/* Description */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text1}}>
              Description
            </Text>
            <TextInput
              ref={descriptionRef}
              style={{
                ...FormStyles.input,
                color: activeColor.text1,
                borderBottomColor: activeColor.text1,
              }}
              onChangeText={value => setInput({...input, DESCRIPTION: value})}
              onPressIn={() => {
                setNumpad(false);
                setCreditList(false);
                setDebitList(false);
              }}
              value={input.DESCRIPTION}
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
                setCreditList(false);
                setDebitList(false);
              }}
              value={input.NOTES}
            />
          </View>
          <View style={FormStyles.buttonField}>
            <Pressable
              style={{
                ...FormStyles.pressable,
                backgroundColor: activeColor.theme,
                flex: 2,
              }}
              onPress={() => submitHandler()}>
              <Text
                style={{...FormStyles.buttonText, color: activeColor.text1}}>
                Submit
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

export default Form;
