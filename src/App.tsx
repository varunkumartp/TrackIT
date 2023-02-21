import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ThemeContext} from './contexts/ThemeContext';
import {CurrencyContext} from './contexts/CurrencyContext';
import {PswdContext} from './contexts/PswdContext';
import {LockContext} from './contexts/LockContext';
import StackNavigator from './components/navigators/StackNavigator/StackNavigator';
import {getData, setData} from './database/encryptedStorage';
import {editTransactionsCurrency} from './database/transactions';
import SplashScreen from 'react-native-splash-screen';

function MainApp(): JSX.Element {
  const [theme, setTheme] = useState({mode: 'Dark'});
  const [currency, setCurrency] = useState({mode: 'INR'});
  const [pswd, setPswd] = useState({mode: ''});
  const [locked, setLocked] = useState(true);
  const [passcode, setPassCode] = useState({mode: 'disable'});

  const updateCurrency = (newCurr: {mode: string}) => {
    setCurrency(newCurr);
    setData('Currency', newCurr);
    editTransactionsCurrency(newCurr.mode);
  };

  const updateTheme = (newTheme: {mode: string}) => {
    setTheme(newTheme);
    setData('Theme', newTheme);
  };

  const updatePswd = (newPswd: {mode: string}) => {
    setData('pswd', newPswd);
    setPswd(newPswd);
  };

  const updatePasscodePref = (pref: {mode: string}) => {
    setData('passcode', pref);
    setPassCode(pref);
  };

  const fetchData = async (
    updateFunction: ({mode}: {mode: string}) => void,
    name: string,
  ) => {
    try {
      const data: {mode: string} = await getData(name);
      if (data) {
        updateFunction(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(updatePasscodePref, 'passcode');
    fetchData(updateTheme, 'Theme');
    fetchData(updateCurrency, 'Currency');
    fetchData(updatePswd, 'pswd');
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <LockContext.Provider
        value={{locked, setLocked, passcode, updatePasscodePref}}>
        <PswdContext.Provider value={{pswd, updatePswd}}>
          <ThemeContext.Provider value={{theme, updateTheme}}>
            <CurrencyContext.Provider value={{currency, updateCurrency}}>
              <StackNavigator />
            </CurrencyContext.Provider>
          </ThemeContext.Provider>
        </PswdContext.Provider>
      </LockContext.Provider>
    </SafeAreaProvider>
  );
}

export default MainApp;
