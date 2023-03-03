import {incomeStatementHTML} from './generateHTML';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {db} from './database';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {ToastAndroid} from 'react-native';
import {DateFilterString} from './dateFilter';

const showToastWithGravity = (message: string) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
};

const fields = [
  'DATE',
  'DESCRIPTION',
  'TYPE',
  'CURRENCY',
  'DEBIT_ACCOUNT',
  'DEBIT_SUB_ACCOUNT',
  'DEBIT_AMOUNT',
  'CREDIT_ACCOUNT',
  'CREDIT_SUB_ACCOUNT',
  'CREDIT_AMOUNT',
  'NOTES',
];

export const exportExcel = async (date: DateFilter, header: string) => {
  const dateFilter = DateFilterString(date);
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
          header: fields,
        });
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

        RNFS.writeFile(
          RNFS.DownloadDirectoryPath + `/Transactions ${header}.xlsx`,
          XLSX.write(wb, {type: 'binary', bookType: 'xlsx'}),
          'ascii',
        )
          .then(r => {
            showToastWithGravity(
              `Transactions ${header} downloaded to Downloads folder`,
            );
          })
          .catch(e => {
            console.log('Error', e);
          });
      },
      err => console.log(err),
    ),
  );
};

export const incomeStatement = async (date: DateFilter, header: string) => {
  const dateFilter = DateFilterString(date);
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT NAME, TYPE,  SUM(AMOUNT) AS AMOUNT FROM
        (SELECT  A.ID AS ACCOUNT_ID,
		        'EXPENSE' as TYPE,
            A.NAME AS NAME,
            SUM(AMOUNT) AS AMOUNT 
            FROM SUB_EXPENSE_LEDGERS AS SEL
            LEFT OUTER JOIN ACCOUNTS AS A
            WHERE A.ID = SEL.ACCOUNT_PARENT AND
            ${dateFilter}
            GROUP BY SEL.ACCOUNT_PARENT
            UNION ALL
            SELECT DEBIT_ID AS ACCOUNT_ID,
            TYPE,
            DEBIT_NAME AS NAME ,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where type='EXPENSE' and 
            DEBIT_PARENT is null and
            ${dateFilter}
            UNION ALL
            SELECT  A.ID AS ACCOUNT_ID,
              'INCOME' as TYPE,
              A.NAME AS NAME,
              SUM(AMOUNT) AS AMOUNT 
              FROM SUB_INCOME_LEDGERS AS SEL
              LEFT OUTER JOIN ACCOUNTS AS A
              WHERE A.ID = SEL.ACCOUNT_PARENT and
              ${dateFilter}
              GROUP BY SEL.ACCOUNT_PARENT
              UNION ALL
              SELECT CREDIT_ID AS ACCOUNT_ID,
              TYPE,
              CREDIT_NAME AS NAME ,
              AMOUNT as AMOUNT 
              from TRANSACTIONS_VIEW 
              where type='INCOME' and 
              CREDIT_PARENT is null and
              ${dateFilter}
              )
            GROUP BY ACCOUNT_ID
            ORDER BY AMOUNT DESC`,
      [],
      async (tx, res) => {
        let arr: transactionsIncStat[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          arr.push(res.rows.item(i));
        }
        let file = await RNHTMLtoPDF.convert({
          html: incomeStatementHTML(arr, header),
          fileName: `Income Statement ${header}`,
          directory: 'Download',
          base64: true,
        });
        RNFS.writeFile(
          RNFS.DownloadDirectoryPath + `/Income Statement ${header}.pdf`,
          file.base64 || '',
          'base64',
        )
          .then(r => {
            showToastWithGravity(
              `Income Statement ${header} downloaded to Downloads folder`,
            );
          })
          .catch(e => {
            console.log('Error', e);
          });
      },
      err => console.log(err),
    ),
  );
};
