import {createContext} from 'react';

interface PswdProp {
  pswd: {
    mode: string;
  };
  updatePswd: (newTheme: {mode: string}) => void;
}

export const PswdContext = createContext<PswdProp>({} as PswdProp);
