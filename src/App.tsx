import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeContext} from './contexts/ThemeContext';
import {CurrencyContext} from './contexts/CurrencyContext';
import {PswdContext} from './contexts/PswdContext';
import {LockContext} from './contexts/LockContext';
import StackNavigator from './components/navigators/StackNavigator/StackNavigator';
import {editTransactionsCurrency} from './database/transactions';
import SplashScreen from 'react-native-splash-screen';
import {setDataSQL} from './database/preferences';
import {db} from './database/database';
import {PermissionsAndroid} from 'react-native';

function MainApp(): JSX.Element {
  const [theme, setTheme] = useState({mode: 'Dark'});
  const [currency, setCurrency] = useState({mode: 'INR'});
  const [pswd, setPswd] = useState({mode: ''});
  const [locked, setLocked] = useState(true);
  const [passcode, setPassCode] = useState({mode: 'disable'});

  const permision = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  };

  const updateCurrency = (newCurr: {mode: string}) => {
    setCurrency(newCurr);
    setDataSQL('Currency', newCurr);
    editTransactionsCurrency(newCurr.mode);
  };

  const updateTheme = (newTheme: {mode: string}) => {
    setTheme(newTheme);
    setDataSQL('Theme', newTheme);
  };

  const updatePswd = (newPswd: {mode: string}) => {
    setDataSQL('pswd', newPswd);
    setPswd(newPswd);
  };

  const updatePasscodePref = (pref: {mode: string}) => {
    setDataSQL('passcode', pref);
    setPassCode(pref);
  };

  const fetchData = async (
    updateFunction: ({mode}: {mode: string}) => void,
    name: string,
  ) => {
    await db.transaction(tx =>
      tx.executeSql(
        `SELECT VALUE FROM PREFERENCES WHERE KEY = '${name}'`,
        [],
        (tx, res) => {
          const value = JSON.parse(res.rows.item(0)['VALUE']);
          if (value.mode.length !== 0) {
            updateFunction(value);
          }
        },
        err => console.log(err),
      ),
    );
  };

  useEffect(() => {
    permision();
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
