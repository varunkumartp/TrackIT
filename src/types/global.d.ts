import {readTransactions} from './../database/transactions';
export {};

declare global {
  /**************** Navigators **************/
  type BottomTabParamList = {
    Transactions: undefined;
    StatsNavigator: undefined;
    Accounts: undefined;
    SettingsNavigator: undefined;
  };

  type RootStackParamList = {
    BottomTab: undefined;
    Form: {data: transactions};
    Calculator: {setData: React.Dispatch<React.SetStateAction<string>>};
    EditForm: {data: transactions};
    FilteredTransactions: {id: string; account: string};
    AccountForm: undefined;
  };

  type StatsStackParamList = {
    Stats: undefined;
    SubStats: {
      PARENT_ID: string;
      PARENT_NAME: string;
      date: {
        month: number;
        year: number;
      };
      value: string;
      type: string;
    };
  };

  type SettingsStackParamList = {
    Settings: undefined;
    Configuration: undefined;
    Accounts: undefined;
    Passcode: undefined;
    Styling: undefined;
    PCManager: undefined;
    Backup: undefined;
  };

  /**************** Accounts Database **************/
  interface Accounts {
    ID: string;
    NAME: string;
    SIGN: number;
    NUMBER: number;
    PARENT_ID: string;
  }

  interface FormAccount {
    ID: string;
    NAME: string;
  }

  interface Theme {
    [key: string]: {
      theme: string;
      text1: string;
      text2: string;
      background: string;
      red: string;
      blue: string;
    };
  }

  interface AccountsGroup {
    ID: string;
    PARENT_ID: string;
    PARENT_NAME: string;
    NAME: string;
    NUMBER: number;
    AMOUNT: number;
  }

  interface AccountsTab {
    title: string;
    data: AccountsGroup[];
  }

  /**************** Transactions Form **************/
  interface inputData {
    DATE: Date;
    NOTES: string;
    DESCRIPTION: string;
  }

  interface formTransaction extends inputData {
    AMOUNT_LOC: string;
    CREDIT: string;
    DEBIT: string;
    TYPE: string;
  }

  interface transactions {
    ID: string;
    DATE: string;
    DESCRIPTION: string;
    DEBIT_ID: string;
    CREDIT_ID: string;
    DEBIT_NAME: string;
    CREDIT_NAME: string;
    DEBIT_DIR: number;
    CREDIT_DIR: number;
    DEBIT_PARENT: string;
    CREDIT_PARENT: string;
    TYPE: string;
    SYMBOL: string;
    AMOUNT_LOC: number;
  }

  type readTransactions = {title: string; data: transactions[]}[];

  /**************** Stats **************/

  interface AccountSum {
    ACCOUNT_ID: string;
    ACCOUNT_NAME: string;
    AMOUNT: number;
    SYMBOL: string;
    color: string;
  }

  /**************** Global **************/
  interface DateFilter {
    month: number;
    year: number;
  }
}
