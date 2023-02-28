import {db} from './database';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {ToastAndroid} from 'react-native';

interface transactionsXLSX {
  DATE: string;
  DESCRIPTION: string;
  TYPE: string;
  NOTES: string;
  CURRENCY: string;
  DEBIT_ACCOUNT: string;
  DEBIT_SUB_ACCOUNT: string;
  DEBIT_AMOUNT: number;
  CREDIT_ACCOUNT: string;
  CREDIT_SUB_ACCOUNT: string;
  CREDIT_AMOUNT: number;
}

const showToastWithGravity = (message: string) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
};

export const exportExcel = async (date: DateFilter) => {
  const dateFilter =
    date.month === -1
      ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
      : date.month !== 0
      ? `strftime('%m', DATE) = '${date.month.toString().padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
      : `strftime('%Y', DATE) = '${date.year}'`;
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT 
        DATE,
        DESCRIPTION,
        TYPE,
        NOTES,
        SYMBOL AS CURRENCY,
        (select NAME FROM ACCOUNTS AS DP WHERE DP.ID = DEBIT_PARENT) AS DEBIT_ACCOUNT, 
        DEBIT_NAME AS DEBIT_SUB_ACCOUNT,
        (DEBIT_DIR * AMOUNT) AS DEBIT_AMOUNT,
        (select NAME FROM ACCOUNTS AS CP WHERE CP.ID = CREDIT_PARENT) AS CREDIT_ACCOUNT,
        CREDIT_NAME AS CREDIT_SUB_ACCOUNT,
        (CREDIT_DIR * AMOUNT) AS CREDIT_AMOUNT
        FROM TRANSACTIONS_VIEW
        WHERE ${dateFilter}
        ORDER BY DATE, TYPE`,
      [],
      (tx, results) => {
        let arr: transactionsXLSX[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          arr.push({
            ...results.rows.item(i),
            DATE: new Date(results.rows.item(i).DATE).toLocaleDateString(),
            TYPE:
              results.rows.item(i).TYPE === 'MAIN'
                ? 'TRANSFER'
                : results.rows.item(i).TYPE,
          });
        }
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(arr, {
          header: [
            'DATE',
            'DESCRIPTION',
            'TYPE',
            'NOTES',
            'CURRENCY',
            'DEBIT_ACCOUNT',
            'DEBIT_SUB_ACCOUNT',
            'DEBIT_AMOUNT',
            'CREDIT_ACCOUNT',
            'CREDIT_SUB_ACCOUNT',
            'CREDIT_AMOUNT',
          ],
        });
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        RNFS.writeFile(
          RNFS.DownloadDirectoryPath + '/TrackIT_Data.xlsx',
          XLSX.write(wb, {type: 'binary', bookType: 'xlsx'}),
          'ascii',
        )
          .then(r => {
            showToastWithGravity('Excel file downloaded to Downloads folder');
          })
          .catch(e => {
            console.log('Error', e);
          });
      },
      err => console.log(err),
    ),
  );
};
