import {incomeStatementHTML, balanceSheetHTML} from './generateHTML';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {db} from './database';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {PermissionsAndroid, ToastAndroid} from 'react-native';
import {DateFilterString} from './dateFilter';
import Share from 'react-native-share';

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
          `${RNFS.DocumentDirectoryPath}/Transactions ${header}.xlsx`,
          XLSX.write(wb, {type: 'binary', bookType: 'xlsx'}),
          'ascii',
        )
          .then(async r => {
            Share.open({
              url: `file://${RNFS.DocumentDirectoryPath}/Transactions ${header}.xlsx`,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }).catch(() => {});
          })
          .catch(e => {
            console.log('Error', e);
            showToastWithGravity(`Download failed`);
          });
      },
    ),
  );
};

const permision = () => {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ).then(res => console.log(res));
};

export const incomeStatement = async (date: DateFilter, header: string) => {
  permision();
  const dateFilter = DateFilterString(date);
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT NAME, TYPE,  SUM(AMOUNT) AS AMOUNT FROM
        (SELECT  A.ID AS ACCOUNT_ID,
            A.NAME AS NAME,
            'EXPENSE' as TYPE, 
            SUM(AMOUNT) AS AMOUNT 
            FROM SUB_EXPENSE_LEDGERS AS SEL
            LEFT OUTER JOIN ACCOUNTS AS A
            WHERE A.ID = SEL.ACCOUNT_PARENT and 
            ${dateFilter}
            GROUP BY SEL.ACCOUNT_PARENT
            UNION ALL
            SELECT DEBIT_ID AS ACCOUNT_ID,
            DEBIT_NAME AS NAME,
            'EXPENSE' as TYPE,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where type='EXPENSE' and 
            DEBIT_PARENT is null and 
            ${dateFilter}
            UNION ALL
       SELECT  A.ID AS ACCOUNT_ID,
            A.NAME AS NAME,
            'INCOME' as TYPE, 
            SUM(AMOUNT) AS AMOUNT 
            FROM SUB_INCOME_LEDGERS AS SEL
            LEFT OUTER JOIN ACCOUNTS AS A
            WHERE A.ID = SEL.ACCOUNT_PARENT and 
            ${dateFilter}
            GROUP BY SEL.ACCOUNT_PARENT
            UNION ALL
            SELECT CREDIT_ID AS ACCOUNT_ID,
            CREDIT_NAME AS NAME,
            'INCOME' as TYPE,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where type='INCOME' and 
            CREDIT_PARENT is null and 
            ${dateFilter})
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
          directory: 'Documents',
          base64: true,
        });
        RNFS.writeFile(
          `${RNFS.DocumentDirectoryPath}/Income-Statement-${header}.pdf`,
          file.base64 || '',
          'base64',
        )
          .then(async r => {
            Share.open({
              url: `file://${RNFS.DocumentDirectoryPath}/Income-Statement-${header}.pdf`,
              type: 'application/pdf',
            }).catch(() => {});
          })
          .catch(e => {
            showToastWithGravity(`Download failed`);
          });
      },
    ),
  );
};

export const balanceSheet = async (date: DateFilter, header: string) => {
  const dateFilter = DateFilterString(date);
  await db.transaction(
    tx =>
      tx.executeSql(
        `select * from(
            select 
                a.name as NAME ,p.name as TYPE ,AMOUNT
                from (SELECT 
                  ACCOUNTS.PARENT_ID as PARENT_ID,
                  sum(ACCOUNTS_LEDGERS.AMOUNT)as AMOUNT
                  FROM ACCOUNTS
                inner JOIN ACCOUNTS_LEDGERS
                where ACCOUNTS.ID = ACCOUNTS_LEDGERS.ACCOUNT_ID
                and ${dateFilter}
                GROUP BY ACCOUNTS.PARENT_ID) as T
                left outer join ACCOUNTS as a
                on a.id = t.parent_id
                left outer join accounts as p
                on a.PARENT_ID = p.id	
            
        union ALL

        select 'Prepaid expenses' as NAME, 
          'Assets' as TYPE, 
          SUM(amount) as AMOUNT 
          from TRANSACTIONS 
          where DEBIT in 
          (select id from ACCOUNTS_EXPENSE 
            union all 
            select id from SUB_ACCOUNTS_EXPENSE)
            and ${dateFilter}
            
        union ALL

        select 'Other Expenses' as NAME, 
          'Assets' as TYPE, 
          SUM(amount) as AMOUNT 
          from TRANSACTIONS 
          where DEBIT in 
          (select id from ACCOUNTS_OTHER
            union all 
            select id from SUB_ACCOUNTS_OTHER)
            and ${dateFilter}

        union ALL

        select 'Taxes' as NAME, 
          'Assets' as TYPE, 
          SUM(amount) as AMOUNT 
          from TRANSACTIONS 
          where DEBIT in 
          (select id from ACCOUNTS_TAX
            union all 
            select id from SUB_ACCOUNTS_TAX)
            and ${dateFilter}
            
        union ALL

        select 'Net Worth' as NAME,
          'Equity' as TYPE,
          sum(amount*-1) as AMOUNT 
          from TRANSACTIONS_VIEW 
          where TYPE='INCOME'
          and ${dateFilter}
        ) order by type`,
        [],
        async (tx, res) => {
          let arr: transactionsIncStat[] = [];
          for (let i = 0; i < res.rows.length; i++) {
            arr.push(res.rows.item(i));
          }
          let file = await RNHTMLtoPDF.convert({
            html: balanceSheetHTML(arr, header),
            fileName: `Balance Sheet ${header}`,
            directory: 'Documents',
            base64: true,
          });
          RNFS.writeFile(
            `${RNFS.DocumentDirectoryPath}/Balance Sheet ${header}.pdf`,
            file.base64 || '',
            'base64',
          )
            .then(async r => {
              Share.open({
                url: `file://${RNFS.DocumentDirectoryPath}/Balance Sheet ${header}.pdf`,
                type: 'application/pdf',
              }).catch(() => {});
            })
            .catch(e => {
              console.log('Error', e);
              showToastWithGravity(`Download failed`);
            });
        },
      ),
    err => console.log(err),
  );
};
