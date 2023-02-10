import uuid from 'react-native-uuid';
import {db} from './database';

/************************************************ Read Accounts ************************************************/

export const getAccounts = async (
  setAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
  type: string,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM ACCOUNTS_${type} ${
        type === 'MAIN'
          ? 'WHERE ID IN (SELECT PARENT_ID FROM SUB_ACCOUNTS_MAIN) ORDER BY NUMBER' // Doesnot fetch Accounts which do not have sub accounts
          : ''
      }`,
      [],
      (tx, results) => {
        let arr: Accounts[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          arr.push(results.rows.item(i));
        }
        setAccounts(arr);
      },
      err => console.log(err),
    ),
  );
};

export const getSubAccounts = async (
  setSubAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
  type: string,
  item: Accounts,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM SUB_ACCOUNTS_${type} WHERE PARENT_ID = '${item.ID}'`,
      [],
      (tx, results) => {
        let arr: Accounts[] = [];
        if (results.rows.length === 0) {
          arr.push(item);
        } else {
          for (let i = 0; i < results.rows.length; i++) {
            arr.push(results.rows.item(i));
          }
        }
        setSubAccounts(arr);
      },
      err => console.log(err),
    ),
  );
};

export const getAccountsTab = async (
  setAccounts: React.Dispatch<React.SetStateAction<AccountsGroup[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM BALANCE_VIEW where ID IN (SELECT ID FROM SUB_ACCOUNTS_MAIN) 
        UNION ALL
        SELECT * FROM BALANCE_VIEW where ID IN (SELECT PARENT_ID FROM SUB_ACCOUNTS_MAIN) 
        ORDER BY NUMBER`,
      [],
      (tx, results) => {
        let arr = [] as AccountsGroup[];
        for (let i = 0; i < results.rows.length; i++) {
          arr.push(results.rows.item(i));
        }
        setAccounts(arr);
      },
      err => console.log(err),
    ),
  );
};

export const getAccountsGroup = async (
  setAccountsGroup: React.Dispatch<React.SetStateAction<Accounts[]>>,
) => {
  db.transaction(
    tx =>
      tx.executeSql(`SELECT * FROM ACCOUNTS_MAIN`, [], (tx, results) => {
        let arr: Accounts[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          arr.push(results.rows.item(i));
        }
        setAccountsGroup(arr);
      }),
    err => console.log(err),
  );
};

/************************************************ Create Accounts ************************************************/

export const createAccounts = async (account: {
  ID: string;
  GROUP: string;
  NAME: string;
  NUMBER: number;
  SIGN: number;
}) => {
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO ACCOUNTS (ID, NAME, NUMBER, SIGN, PARENT_ID) 
      values 
      ('${uuid.v4()}',
      '${account.NAME}',
      (select max(number) 
          from accounts 
          where number between ${account.NUMBER} and 
          ${account.NUMBER + 999})+1,
      ${account.SIGN},
      '${account.ID}')`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};
