import uuid from 'react-native-uuid';
import {db} from './database';

export const getAccounts = async (
  setAccounts: React.Dispatch<React.SetStateAction<Accounts[]>>,
  type: string,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM ACCOUNTS_${type}`,
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
