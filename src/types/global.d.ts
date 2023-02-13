import {readTransactions} from './../database/transactions';
export {};

declare global {
  /**************** Navigators **************/
  type BottomTabParamList = {
    Transactions: undefined;
    StatsNavigator: undefined;
    Accounts: undefined;
    More: undefined;
  };

  type RootStackParamList = {
    BottomTab: undefined;
    Form: {data: transactions};
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
    // SubStats: undefined;
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
      text: string;
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
    AMOUNT_LOC: string;
    NOTES: string;
    DESCRIPTION: string;
  }

  interface formTransaction extends inputData {
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
}
