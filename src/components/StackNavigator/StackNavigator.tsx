import {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ThemeContext} from '../../contexts/ThemeContext';

import {Theme} from '../../globals/Theme';
import BottomTab from '../BottomTab/BottomTab';
import Form from '../Transactions/Form/Form';

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
          headerTintColor: activeColor.text,
        }}>
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{header: () => null}}
        />
        <Stack.Screen
          name="Form"
          component={Form}
          options={{title: 'New Transaction'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
