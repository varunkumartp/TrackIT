import {db} from './database';
import uuid from 'react-native-uuid';

export const getDate = (date: Date) => {
  var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, -1);
};

export const createTransactions = async (data: formTransaction) => {
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO TRANSACTIONS 
      (ID,DATE,DESCRIPTION,DEBIT,CREDIT,TYPE,AMOUNT_LOC,CURR_LOC,AMOUNT,NOTES) 
      VALUES
      ('${uuid.v4()}',
      '${getDate(data.DATE)}',
      '${data.DESCRIPTION}',
      '${data.DEBIT}',
      '${data.CREDIT}',
      '${data.TYPE}',
      ${parseInt(data.AMOUNT_LOC)},
      '${data.CURR_LOC}',
      ${parseInt(data.AMOUNT_LOC)},
      '${data.NOTES}')`,
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
        *,
    		(select NAME FROM ACCOUNTS AS DP WHERE DP.ID = T.DEBIT_PARENT) AS DEBIT_PARENT, 
        (select NAME FROM ACCOUNTS AS CP WHERE CP.ID = T.CREDIT_PARENT) AS CREDIT_PARENT
        FROM TRANSACTIONS_VIEW AS T
        WHERE 
        ${
          date.month === -1
            ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
            : date.month !== 0
            ? `strftime('%m', DATE) = '${date.month
                .toString()
                .padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
            : `strftime('%Y', DATE) = '${date.year}'`
        }
        ${
          accountID === undefined
            ? ''
            : `and (DEBIT_ID = '${accountID}' OR CREDIT_ID = '${accountID}')`
        } 
         order by DATE desc`,
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
export const readFilteredTransactions = async (
  setTransactions: React.Dispatch<React.SetStateAction<readTransactions>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  date: {month: number; year: number},
  accountID: string[],
  amount: {min: string; max: string},
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT 
        *,
    		(select NAME FROM ACCOUNTS AS DP WHERE DP.ID = T.DEBIT_PARENT) AS DEBIT_PARENT, 
        (select NAME FROM ACCOUNTS AS CP WHERE CP.ID = T.CREDIT_PARENT) AS CREDIT_PARENT
        FROM TRANSACTIONS_VIEW AS T
        WHERE 
        ${
          date.month === -1
            ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
            : date.month !== 0
            ? `strftime('%m', DATE) = '${date.month
                .toString()
                .padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
            : `strftime('%Y', DATE) = '${date.year}'`
        }
        ${amount.min !== '' ? `AND AMOUNT_LOC>${amount.min}` : ''}
        ${amount.max !== '' ? `AND AMOUNT_LOC<${amount.max}` : ''}
        AND (DEBIT_ID IN (${accountID.join(',')}) or 
        CREDIT_ID IN (${accountID.join(',')}))
        order by DATE desc`,
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
      AMOUNT=${data.AMOUNT_LOC},
      NOTES='${data.NOTES}'
      WHERE ID = '${ID}'`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};

export const editTransactionsCurrency = async (curr: string) => {
  await db.transaction(tx =>
    tx.executeSql(
      `UPDATE TRANSACTIONS SET CURR_LOC='${curr}'`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};
