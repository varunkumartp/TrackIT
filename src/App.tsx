import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ThemeContext} from './contexts/ThemeContext';
import {CurrencyContext} from './contexts/CurrencyContext';
import StackNavigator from './components/navigators/StackNavigator/StackNavigator';
import {getData, setData} from './database/asyncStorage';
import {editTransactionsCurrency} from './database/transactions';
import SplashScreen from 'react-native-splash-screen';

function MainApp(): JSX.Element {
  const [theme, setTheme] = useState({mode: 'Dark'});
  const [currency, setCurrency] = useState({mode: 'INR'});

  const updateCurrency = (newCurr: {mode: string}) => {
    setCurrency(newCurr);
    setData('Currency', newCurr);
    editTransactionsCurrency(newCurr.mode);
  };

  const updateTheme = (newTheme: {mode: string}) => {
    setTheme(newTheme);
    setData('Theme', newTheme);
  };

  const fetchCurrency = async () => {
    try {
      const currData: {mode: string} = await getData('Currency');
      if (currData) {
        updateCurrency(currData);
      }
    } catch ({message}) {
      console.log(message);
    }
  };

  const fetchTheme = async () => {
    try {
      const themeData: {mode: string} = await getData('Theme');
      if (themeData) {
        updateTheme(themeData);
      }
    } catch ({message}) {
      console.log(message);
    }
  };

  useEffect(() => {
    fetchTheme();
    fetchCurrency();
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{theme, updateTheme}}>
        <CurrencyContext.Provider value={{currency, updateCurrency}}>
          <StackNavigator />
        </CurrencyContext.Provider>
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

export default MainApp;
