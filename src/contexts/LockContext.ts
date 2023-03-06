import { createContext } from 'react';

interface LockProp {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
  passcode: {
    mode: string;
  };
  updatePasscodePref: (pref: {mode: string}) => void;
}

export const LockContext = createContext<LockProp>({} as LockProp);
