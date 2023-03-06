import { createContext } from 'react';

interface CurrencyProp {
  currency: {
    mode: string;
  };
  updateCurrency: (newTheme: {mode: string}) => void;
}

export const CurrencyContext = createContext<CurrencyProp>({} as CurrencyProp);
