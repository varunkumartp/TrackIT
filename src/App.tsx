import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ThemeContext} from './contexts/ThemeContext';
import StackNavigator from './components/navigators/StackNavigator/StackNavigator';

function MainApp(): JSX.Element {
  const [theme, setTheme] = useState({mode: 'dark'});
  const updateTheme = (newTheme: {mode: string}) => {
    setTheme(newTheme);
  };

  return (
    <SafeAreaProvider>
      <ThemeContext.Provider value={{theme, updateTheme}}>
        <StackNavigator />
      </ThemeContext.Provider>
    </SafeAreaProvider>
  );
}

export default MainApp;
