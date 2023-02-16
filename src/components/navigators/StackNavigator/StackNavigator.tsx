import {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ThemeContext} from '../../../contexts/ThemeContext';

import {Theme} from '../../../globals/Theme';
import BottomTab from '../BottomTab/BottomTab';
import Form from '../../Transactions/Form/Form';
import FilteredTransactions from '../../Transactions/FilteredTransactions';
import AccountForm from '../../Accounts/AccountForm';
import EditForm from '../../Transactions/Form/EditForm';
import AccountEditForm from '../../Settings/Screens/Accounts/AccountEditForm';
import IncExpStats from '../../Stats/IncExpStats';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator(): JSX.Element {
  const {theme} = useContext(ThemeContext);
  let activeColor = Theme[theme.mode];

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomTab"
        screenOptions={{
          headerStyle: {
            backgroundColor: activeColor.theme,
          },
          headerTintColor: activeColor.text1,
        }}>
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Form"
          component={Form}
          options={{
            title: 'New Transaction',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="EditForm"
          component={EditForm}
          options={{
            title: 'Edit Transaction',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="AccountForm"
          component={AccountForm}
          options={{title: 'New Account', animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="AccountEditForm"
          component={AccountEditForm}
          options={{title: 'Edit Account', animation: 'slide_from_bottom'}}
        />
        <Stack.Screen
          name="FilteredTransactions"
          component={FilteredTransactions}
          options={({route}) => ({
            title: route.params.account,
          })}
        />
        <Stack.Screen
          name="IncExpStats"
          component={IncExpStats}
          options={{header: () => null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
