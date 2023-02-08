export {};

declare global {
  type BottomTabParamList = {
    Transactions: undefined;
    Stats: undefined;
    Accounts: undefined;
    More: undefined;
  };

  type RootStackParamList = {
    BottomTab: undefined;
    Form: {type: string};
  };

  /**************** Accounts Database **************/
  interface Accounts {
    ID: string;
    NAME: string;
    SIGN: number;
    PARENT_ID: string;
  }

  interface Theme {
    [key: string]: {
      theme: string;
      text: string;
      background: string;
    };
  }

  /**************** Transactions Form **************/
  interface inputData {
    date: Date;
    amount: string;
    notes: string;
    description: string;
  }

  interface formTransaction extends inputData {
    credit: string;
    debit: string;
  }
}
