import {View, Text, TextInput, Pressable, Keyboard} from 'react-native';
import React, {createRef, useContext, useState} from 'react';

import DatePicker from 'react-native-date-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import ButtonGroup from './ButtonGroup';

import {ThemeContext} from '../../../contexts/ThemeContext';
import {Theme} from '../../../globals/Theme';
import {FormStyles} from '../../../globals/Form.Styles';
import AccountsList from './AccountsList';
import {insertTransactions} from '../../../database/transactions';

type FormProps = NativeStackScreenProps<RootStackParamList, 'Form'>;

const Form = ({route, navigation}: FormProps) => {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];
  const [type, setType] = useState(route.params.type);
  const [open, setOpen] = useState(false);
  const [debitAccount, setDebitAccount] = useState<Accounts>({} as Accounts);
  const [creditAccount, setCreditAccount] = useState<Accounts>({} as Accounts);
  const [creditList, setCreditList] = useState(false);
  const [debitList, setDebitList] = useState(false);
  const [input, setInput] = useState<inputData>({
    date: new Date(),
    amount: '',
    description: '',
    notes: '',
  });
  const debitRef = createRef<TextInput>();
  const creditRef = createRef<TextInput>();
  const amountRef = createRef<TextInput>();
  const descriptionRef = createRef<TextInput>();

  const typeHandler = (newType: string) => {
    setType(newType);
    setCreditAccount({} as Accounts);
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
    insertTransactions({
      ...input,
      debit: type === 'EXPENSE' ? creditAccount.ID : debitAccount.ID,
      credit: type === 'EXPENSE' ? debitAccount.ID : creditAccount.ID,
    });
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
        defaultKey="EXPENSE"
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
          date={input.date}
          onConfirm={date => {
            setOpen(false);
            setInput({...input, date: date});
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
        <View style={FormStyles.parentContainer}>
          {/* Date */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              Date
            </Text>
            <TextInput
              style={{...FormStyles.input, color: activeColor.text}}
              onPressIn={() => {
                setOpen(true);
                setDebitList(false);
                setCreditList(false);
              }}
              value={input.date.toLocaleDateString()}
              showSoftInputOnFocus={false}
              onContentSizeChange={() => debitRef.current?.focus()}
            />
          </View>
          {/* Debit Account */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              {type === 'EXPENSE' || type === 'INCOME'
                ? 'Account'
                : 'Debit Account'}
            </Text>
            <TextInput
              ref={debitRef}
              style={{...FormStyles.input, color: activeColor.text}}
              value={debitAccount.NAME}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                Keyboard.dismiss();
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
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              {type === 'EXPENSE' || type === 'INCOME'
                ? 'Category'
                : 'Credit Account'}
            </Text>
            <TextInput
              ref={creditRef}
              style={{...FormStyles.input, color: activeColor.text}}
              value={creditAccount.NAME}
              showSoftInputOnFocus={false}
              onPressIn={() => {
                Keyboard.dismiss();
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
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              Amount
            </Text>
            <TextInput
              ref={amountRef}
              style={{...FormStyles.input, color: activeColor.text}}
              keyboardType={'number-pad'}
              onChangeText={value => setInput({...input, amount: value})}
              onPressIn={() => {
                setCreditList(false);
                setDebitList(false);
              }}
              onSubmitEditing={() => descriptionRef.current?.focus()}
            />
          </View>
          {/* Description */}
          <View style={FormStyles.fields}>
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              Description
            </Text>
            <TextInput
              ref={descriptionRef}
              style={{...FormStyles.input, color: activeColor.text}}
              onChangeText={value => setInput({...input, description: value})}
              onPressIn={() => {
                setCreditList(false);
                setDebitList(false);
              }}
            />
          </View>
          {/* Notes */}
          <View style={{...FormStyles.fields}}>
            <Text style={{...FormStyles.text, color: activeColor.text}}>
              Notes
            </Text>
            <TextInput
              style={{...FormStyles.input, color: activeColor.text}}
              onChangeText={value => setInput({...input, notes: value})}
              onPressIn={() => {
                setCreditList(false);
                setDebitList(false);
              }}
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
              <Text style={{...FormStyles.buttonText, color: activeColor.text}}>
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
              <Text style={{...FormStyles.buttonText, color: activeColor.text}}>
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
    </View>
  );
};

export default Form;
