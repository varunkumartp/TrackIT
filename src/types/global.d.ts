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
    FilterTransactionsByAccount: {id: string; account: string};
    AccountForm: undefined;
    AccountEditForm: {data: AccountsGroup};
    IncExpStats: undefined;
    FilterScreen: undefined;
    FilteredTransactions: {id: string[]; amount: {min: string; max: string}};
    AppLockScreen: undefined;
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
    ConfigNavigator: undefined;
    Accounts: undefined;
    Passcode: undefined;
    Styling: undefined;
    PCManager: undefined;
    Backup: undefined;
  };

  type ConfigStackParamList = {
    Configuration: undefined;
    Categories: {type: string};
    SubCategories: {ID: string; name: string; type: string};
    CategoryForm: {ID: string; type: string; name: string};
    SubCategoryForm: {ID: string; type: string; name: string};
    DefaultCurrency: undefined;
  };

  /**************** Accounts Database **************/
  interface Accounts {
    ID: string;
    NAME: string;
    SIGN: number;
    NUMBER: number;
    PARENT_ID: string;
  }

  interface AccountsFilter extends Accounts {
    TYPE: string;
    isChecked: boolean;
  }

  interface FormAccount {
    ID: string;
    NAME: string;
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
    CURR_LOC: string;
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
    NOTES: string;
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

  interface IncExp {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  }

  /**************** Currencies **************/
  interface Currency {
    KEY: string;
    NAME: string;
    SYMBOL: string;
  }

  type readCurrency = {title: string; data: Currency[]}[];

  /**************** Global **************/
  interface DateFilter {
    month: number;
    year: number;
  }

  interface Theme {
    [key: string]: {
      [theme: string]: string;
      [text1: string]: string;
      [text2: string]: string;
      [background: string]: string;
      [red: string]: string;
      [blue: string]: string;
    };
  }
}
