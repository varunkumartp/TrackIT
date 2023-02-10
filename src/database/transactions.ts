import {db} from './database';
import uuid from 'react-native-uuid';

const getDate = (date: Date) => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
};

export const createTransactions = async (data: formTransaction) => {
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO TRANSACTIONS 
      (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT) 
      VALUES
      ('${uuid.v4()}',
      '${getDate(data.DATE)}',
      '${data.DESCRIPTION}',
      '${data.DEBIT}',
      '${data.CREDIT}',
      '${data.TYPE}',
      ${parseInt(data.AMOUNT_LOC)},
      'INR',
      ${parseInt(data.AMOUNT_LOC)})`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};

export const readTransactions = async (
  setTransactions: React.Dispatch<React.SetStateAction<readTransactions>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  date: {month: number; year: number},
  accountID?: string,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT 
        T.ID,T.DATE,T.DESCRIPTION,
        T.DEBIT_ID, T.DEBIT_NAME, T.DEBIT_DIR, AD.NAME AS DEBIT_PARENT,  
        T.CREDIT_ID, T.CREDIT_NAME, T.CREDIT_DIR, AC.NAME AS CREDIT_PARENT,  
        T.TYPE,
        T.SYMBOL,
        T.AMOUNT_LOC
        FROM TRANSACTIONS_VIEW AS T
        LEFT OUTER JOIN ACCOUNTS AS AD
        LEFT OUTER JOIN ACCOUNTS AS AC
        where AD.ID = T.DEBIT_PARENT AND
            AC.ID = T.CREDIT_PARENT AND
            strftime('%m', date) = '${date.month.toString().padStart(2, '0')}' AND
            strftime('%Y', date) = '${date.year}'
            ${
              accountID === undefined
                ? ''
                : `and (DEBIT_ID = '${accountID}' OR CREDIT_ID = '${accountID}')`
            } 
            order by DATE desc;`,
      [],
      (tx, results) => {
        let arr: readTransactions = [];
        if (results.rows.length === 0) {
          arr.push({title: 'No Data Found', data: []});
        } else {
          let prevDate = '';
          for (let i = 0; i < results.rows.length; i++) {
            let date = new Date(results.rows.item(i).DATE).toLocaleDateString();
            if (prevDate !== date) {
              prevDate = date;
              arr.push({title: date, data: []});
            }
            arr[arr.length - 1].data.push(results.rows.item(i));
          }
        }
        setLoading(false);
        setTransactions(arr);
      },
      err => console.log(err),
    ),
  );
};

export const deleteTransaction = async (ID: string) => {
  await db.transaction(tx =>
    tx.executeSql(
      `DELETE FROM TRANSACTIONS WHERE ID = '${ID}'`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};

export const editTransaction = async (ID: string, data: formTransaction) => {
  await db.transaction(tx =>
    tx.executeSql(
      `UPDATE TRANSACTIONS SET 
      DATE='${getDate(new Date(data.DATE))}',
      DESCRIPTION='${data.DESCRIPTION}',
      DEBIT='${data.DEBIT}',
      CREDIT='${data.CREDIT}',
      TYPE='${data.TYPE}',
      AMOUNT_LOC=${data.AMOUNT_LOC},
      AMOUNT=${data.AMOUNT_LOC}
      WHERE ID = '${ID}'`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};
