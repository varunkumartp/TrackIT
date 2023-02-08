import { createContext } from 'react';

interface ThemeProp {
    theme: {
        mode: string;
    };
    updateTheme: (newTheme: {
        mode: string;
    }) => void
}

export const ThemeContext = createContext<ThemeProp>({} as ThemeProp);