import uuid from 'react-native-uuid';
import { db } from './database';
import { helper } from './helper';

/************************************************ Read Accounts ************************************************/

export const getAllAccounts = async (
  setAccounts: React.Dispatch<React.SetStateAction<AccountsFilter[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT *, 'MAIN' AS TYPE FROM ACCOUNTS_MAIN
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM ACCOUNTS_EXPENSE
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM ACCOUNTS_TAX
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM ACCOUNTS_OTHER       
       UNION ALL
       SELECT *, 'INCOME' AS TYPE FROM ACCOUNTS_INCOME
       UNION ALL
       SELECT *, 'MAIN' AS TYPE FROM SUB_ACCOUNTS_MAIN
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM SUB_ACCOUNTS_EXPENSE
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM SUB_ACCOUNTS_TAX
       UNION ALL
       SELECT *, 'EXPENSE' AS TYPE FROM SUB_ACCOUNTS_OTHER
       UNION ALL
       SELECT *, 'INCOME' AS TYPE FROM SUB_ACCOUNTS_INCOME
       ORDER BY NUMBER`,
      [],
      (tx, results) => {
        helper(results, setAccounts);
      },
    ),
  );
};

export const getAccounts = async (
  setAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
  type: string,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM ACCOUNTS_${type} 
      ${
        type === 'EXPENSE'
          ? 'union all select * from ACCOUNTS_TAX union all select * from ACCOUNTS_OTHER'
          : ''
      }
      ${
        type === 'MAIN'
          ? 'WHERE ID IN (SELECT PARENT_ID FROM SUB_ACCOUNTS_MAIN) ORDER BY NUMBER' // Doesnot fetch Accounts which do not have sub accounts
          : ''
      }`,
      [],
      (tx, results) => helper(results, setAccounts),
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
      `select * from 
      (
       SELECT * 
       FROM SUB_ACCOUNTS_${type} 
       ${
         type === 'EXPENSE'
           ? 'UNION ALL SELECT * FROM SUB_ACCOUNTS_TAX UNION ALL SELECT * FROM SUB_ACCOUNTS_OTHER '
           : ''
       }
       )WHERE PARENT_ID = '${item.ID}'`,
      [],
      (tx, results) => {
        if (results.rows.length === 0) {
          setSubAccounts([item]);
        } else {
          helper(results, setSubAccounts);
        }
      },
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
      (tx, results) => helper(results, setAccounts),
    ),
  );
};

export const getAccountsSettings = async (
  setAccounts: React.Dispatch<React.SetStateAction<AccountsTab[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `select SAM.ID,SAM.NAME,SAM.NUMBER,SAM.SIGN,A.NAME AS PARENT_NAME, AMOUNT
        from SUB_ACCOUNTS_MAIN AS SAM
        LEFT OUTER JOIN ACCOUNTS AS A
        ON A.ID = SAM.PARENT_ID
        left outer join BALANCE_VIEW as BV
        on BV.ID = SAM.ID
        ORDER by SAM.NUMBER`,
      [],
      (tx, results) => {
        let arr = [] as AccountsTab[];
        let prevHeader = '';

        for (let i = 0; i < results.rows.length; i++) {
          let header = results.rows.item(i).PARENT_NAME;
          if (prevHeader !== header) {
            prevHeader = header;
            arr.push({title: header, data: []});
          }
          arr[arr.length - 1].data.push(results.rows.item(i));
        }
        setAccounts(arr);
      },
    ),
  );
};

export const getAccountsGroup = async (
  setAccountsGroup: React.Dispatch<React.SetStateAction<Accounts[]>>,
) => {
  db.transaction(tx =>
    tx.executeSql(`SELECT * FROM ACCOUNTS_MAIN`, [], (tx, results) =>
      helper(results, setAccountsGroup),
    ),
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
    ),
  );
};

/************************************************ Edit Accounts ************************************************/

export const deleteAccount = async (
  ID: string,
  setAccounts: React.Dispatch<React.SetStateAction<AccountsTab[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(`DELETE FROM ACCOUNTS WHERE ID='${ID}'`, [], () => {}),
  );
  getAccountsSettings(setAccounts);
};

export const deleteAccountTransactions = async (
  ID: string,
  setAccounts: React.Dispatch<React.SetStateAction<AccountsTab[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `DELETE FROM TRANSACTIONS WHERE DEBIT='${ID}' OR CREDIT='${ID}'`,
    ),
  );
  deleteAccount(ID, setAccounts);
};
/************************************************ Edit Accounts ************************************************/

export const editAccount = async (
  data: {
    ID: string;
    GROUP: string;
    NAME: string;
    NUMBER: number;
  },
  ID: string,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `update ACCOUNTS set 
        NAME='${data.NAME}'
        ${
          data.ID === ''
            ? ''
            : `,NUMBER=(select max(NUMBER) from ACCOUNTS where NUMBER between ${
                data.NUMBER
              } and ${data.NUMBER + 999})+1`
        }
        ${data.ID === '' ? '' : `,PARENT_ID = '${data.ID}'`} 
        ${
          data.ID === ''
            ? ''
            : `,SIGN = (select SIGN from ACCOUNTS where NUMBER = ${data.NUMBER})`
        } 
        where id='${ID}'`,
    ),
  );
};
