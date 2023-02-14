import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ThemeContext} from './contexts/ThemeContext';
import StackNavigator from './components/navigators/StackNavigator/StackNavigator';
import { getData } from './database/asyncStorage';

function MainApp(): JSX.Element {
  const [theme, setTheme] = useState({mode: 'Dark'});
  const updateTheme = (newTheme: {mode: string}) => {
    setTheme(newTheme);
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
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{theme, updateTheme}}>
        <StackNavigator />
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

export default MainApp;
