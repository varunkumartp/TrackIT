import {helper} from './helper';
import uuid from 'react-native-uuid';
import {db} from './database';

/************************************************ Read Categories ************************************************/

export const createCategories = async (name: string, type: string) => {
  const number = type === 'Expense' ? 500000 : 400000;
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO ACCOUNTS (ID, NAME, NUMBER, SIGN, PARENT_ID) VALUES 
        ('${uuid.v4()}',
            '${name}',
            (SELECT MAX(NUMBER) FROM ACCOUNTS_${type.toUpperCase()})+1000,
            (SELECT SIGN FROM ACCOUNTS WHERE NUMBER=${number}),
            ${null})`,
    ),
  );
};

export const createSubCategories = async (
  name: string,
  type: string,
  id: string,
) => {
  const number = type === 'Expense' ? 500000 : 400000;
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO ACCOUNTS (ID, NAME, NUMBER, SIGN, PARENT_ID) VALUES 
        ('${uuid.v4()}',
            '${name}',
            (SELECT MAX(NUMBER) FROM SUB_ACCOUNTS_${type.toUpperCase()} WHERE PARENT_ID='${id}')+1,
            (SELECT SIGN FROM ACCOUNTS WHERE NUMBER=${number}),
            '${id}')`,
    ),
  );
};

/************************************************ Read Categories ************************************************/

export const updateCategories = async (id: string, name: string) => {
  await db.transaction(tx =>
    tx.executeSql(`UPDATE ACCOUNTS SET NAME='${name}' WHERE ID='${id}'`),
  );
};

/************************************************ Check Categories ************************************************/

export const checkIfSubCategories = async (
  id: string,
  setCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `select count(PARENT_ID) as NUM from ACCOUNTS where PARENT_ID='${id}'`,
      [],
      (tx, results) => {
        setCount(results.rows.item(0).NUM);
      },
    ),
  );
};

export const checkCategories = async (
  id: string,
  type: string,
  setCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT COUNT(ACCOUNT_ID) as NUM FROM SUB_${
        ['Expense', 'Other', 'Tax'].includes(type)
          ? 'EXPENSE'
          : type.toLowerCase()
      }_LEDGERS WHERE ACCOUNT_ID='${id}'`,
      [],
      (tx, results) => {
        setCount(results.rows.item(0).NUM);
      },
    ),
  );
};

export const checkSubCategories = async (
  id: string,
  setCount: React.Dispatch<React.SetStateAction<number>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT COUNT(PARENT_ID) as NUM FROM ACCOUNTS WHERE PARENT_ID='${id}'`,
      [],
      (tx, results) => {
        setCount(results.rows.item(0).NUM);
      },
    ),
  );
};

/************************************************ Delete Categories ************************************************/

export const deleteCategories = async (ID: string) => {
  await db.transaction(tx =>
    tx.executeSql(`DELETE FROM ACCOUNTS WHERE ID = '${ID}'`, [], () => {}),
  );
};

export const deleteCategoriesTransactions = async (ID: string) => {
  await db.transaction(tx =>
    tx.executeSql(
      `DELETE FROM TRANSACTIONS WHERE DEBIT='${ID}' OR CREDIT='${ID}'`,
    ),
  );
};

export const deleteCatSubCategories = async (id: string) => {
  await db.transaction(tx =>
    tx.executeSql(`DELETE FROM ACCOUNTS WHERE PARENT_ID = '${id}'`),
  );
};

/************************************************ Read Categories ************************************************/

export const getCategories = async (
  type: string,
  setAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM ACCOUNTS_${type.toUpperCase()}`,
      [],
      (tx, results) => helper(results, setAccounts),
    ),
  );
};

export const getSubCategories = async (
  id: string,
  type: string,
  setSubAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM SUB_ACCOUNTS_${type.toUpperCase()} where PARENT_ID='${id}'`,
      [],
      (tx, results) => helper(results, setSubAccounts),
    ),
  );
};
