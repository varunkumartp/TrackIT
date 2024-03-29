import { useContext } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ThemeContext } from '../../../contexts/ThemeContext';

import { LockContext } from '../../../contexts/LockContext';
import { Theme } from '../../../globals/Theme';
import AccountForm from '../../Accounts/AccountForm';
import AppLockScreen from '../../AppLockScreen/AppLockScreen';
import AccountEditForm from '../../Settings/Screens/Accounts/AccountEditForm';
import IncExpStats from '../../Stats/IncExpStats';
import FilteredTransactions from '../../Transactions/FilteredTransactions';
import FilterScreen from '../../Transactions/FilterScreen';
import FilterTransactionsByAccount from '../../Transactions/FilterTransactionsByAccount';
import EditForm from '../../Transactions/Form/EditForm';
import Form from '../../Transactions/Form/Form';
import BottomTab from '../BottomTab/BottomTab';
const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  const {theme} = useContext(ThemeContext);
  const {locked, passcode} = useContext(LockContext);
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
        {locked && passcode.mode === 'enable' ? (
          <>
            <Stack.Screen
              name="AppLockScreen"
              component={AppLockScreen}
              options={{header: () => null}}
            />
          </>
        ) : (
          <>
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
              name="FilterTransactionsByAccount"
              component={FilterTransactionsByAccount}
              options={({route}) => ({
                title: route.params.account,
              })}
            />
            <Stack.Screen
              name="FilteredTransactions"
              component={FilteredTransactions}
              options={{
                title:'Filtered Transactions'
              }}
            />
            <Stack.Screen
              name="IncExpStats"
              component={IncExpStats}
              options={{
                header: () => null,
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="FilterScreen"
              component={FilterScreen}
              options={{
                title: 'Filter Transactions',
                animation: 'slide_from_bottom',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
