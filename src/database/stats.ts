import {DateFilterString} from './dateFilter';
import {db} from './database';
import {getDate} from './transactions';

const colors = [
  '#f97263',
  '#ff964c',
  '#ffd448',
  '#cad94e',
  '#78b661',
  '#5caf61',
  '#56a780',
  '#55b5cb',
  '#4594d4',
  '#6775a9',
  '#606aad',
  '#7a6bab',
  '#a56ca6',
  '#d0589c',
  '#d2506e',
];

export const expenseHeaderSum = async (
  date: DateFilter,
  setAccountSum: React.Dispatch<React.SetStateAction<AccountSum[]>>,
  setExpenseSum: React.Dispatch<React.SetStateAction<number>>,
) => {
  const dateFilter = DateFilterString(date);
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT ACCOUNT_ID,ACCOUNT_NAME, SYMBOL, SUM(AMOUNT) AS AMOUNT FROM
        (SELECT  A.ID AS ACCOUNT_ID,
            A.NAME AS ACCOUNT_NAME,
            SYMBOL,
            SUM(AMOUNT) AS AMOUNT 
        FROM SUB_EXPENSE_LEDGERS AS SEL
        LEFT OUTER JOIN ACCOUNTS AS A
        WHERE A.ID = SEL.ACCOUNT_PARENT AND
        ${dateFilter}
        GROUP BY SEL.ACCOUNT_PARENT
        UNION ALL
        SELECT DEBIT_ID AS ACCOUNT_ID,
            DEBIT_NAME AS ACCOUNT_NAME ,
            SYMBOL,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where type='EXPENSE' and 
            DEBIT_PARENT is null AND 
            ${dateFilter})
            GROUP BY ACCOUNT_ID
            ORDER BY AMOUNT DESC`,
      [],
      (tx, results) => {
        let arr = [] as AccountSum[];
        let sum: number = 0;
        if (results.rows.length === 0) {
          setAccountSum([
            {
              ACCOUNT_ID: '',
              ACCOUNT_NAME: '',
              AMOUNT: 0,
              SYMBOL: '₹',
              color: 'white',
            },
          ]);
        } else {
          for (let i = 0; i < results.rows.length; i++) {
            arr.push({
              ...results.rows.item(i),
              color: colors[i % colors.length],
            });
            sum = sum + results.rows.item(i).AMOUNT;
          }
          setAccountSum(arr);
          setExpenseSum(sum);
        }
      },
      err => console.log(err),
    ),
  );
};

export const incomeHeaderSum = async (
  date: DateFilter,
  setAccountSum: React.Dispatch<React.SetStateAction<AccountSum[]>>,
  setIncomeSum: React.Dispatch<React.SetStateAction<number>>,
) => {
  const dateFilter = DateFilterString(date);
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT ACCOUNT_ID,ACCOUNT_NAME, SYMBOL, SUM(AMOUNT) AS AMOUNT FROM
        (SELECT  A.ID AS ACCOUNT_ID,
            A.NAME AS ACCOUNT_NAME,
            SYMBOL,
            SUM(AMOUNT) AS AMOUNT 
            FROM SUB_INCOME_LEDGERS AS SIL
            LEFT OUTER JOIN ACCOUNTS AS A
            WHERE A.ID = SIL.ACCOUNT_PARENT AND
            ${dateFilter}
            GROUP BY SIL.ACCOUNT_PARENT
        UNION ALL
        SELECT CREDIT_ID AS ACCOUNT_ID,
            CREDIT_NAME AS ACCOUNT_NAME ,
            SYMBOL,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where type='INCOME' and 
            CREDIT_PARENT is null AND 
            ${dateFilter})
            GROUP BY ACCOUNT_ID
            ORDER BY AMOUNT DESC`,
      [],
      (tx, results) => {
        let arr = [] as AccountSum[];
        let sum: number = 0;
        if (results.rows.length === 0) {
          setAccountSum([
            {
              ACCOUNT_ID: '',
              ACCOUNT_NAME: '',
              AMOUNT: 0,
              SYMBOL: '₹',
              color: 'white',
            },
          ]);
        } else {
          for (let i = 0; i < results.rows.length; i++) {
            arr.push({
              ...results.rows.item(i),
              color: colors[i % colors.length],
            });
            sum = sum + results.rows.item(i).AMOUNT;
          }
          setIncomeSum(sum);
          setAccountSum(arr);
        }
      },
      err => console.log(err),
    ),
  );
};

export const subHeaderSum = async (
  date: DateFilter,
  PARENT_ID: string,
  type: string,
  setAccountSum: React.Dispatch<React.SetStateAction<AccountSum[]>>,
  setAmountSum: React.Dispatch<React.SetStateAction<number>>,
) => {
  const dateFilter = DateFilterString(date);
  const mainQuery = `SELECT ACCOUNT_ID,ACCOUNT_NAME, SYMBOL, SUM(AMOUNT) AS AMOUNT FROM
        (SELECT ACCOUNT_ID,
            ACCOUNT_NAME,
            SYMBOL,
            AMOUNT 
            FROM SUB_${type}_LEDGERS 
            WHERE ACCOUNT_PARENT = '${PARENT_ID}' AND 
            ${dateFilter}
            UNION ALL `;
  const expenseQuery = `SELECT DEBIT_ID AS ACCOUNT_ID,
            DEBIT_NAME AS ACCOUNT_NAME ,
            SYMBOL,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where DEBIT_ID = '${PARENT_ID}' and 
            DEBIT_PARENT is null and
            ${dateFilter})
            GROUP BY ACCOUNT_ID
            ORDER BY AMOUNT DESC`;
  const incomeQuery = `SELECT CREDIT_ID AS ACCOUNT_ID,
            CREDIT_NAME AS ACCOUNT_NAME ,
            SYMBOL,
            AMOUNT as AMOUNT 
            from TRANSACTIONS_VIEW 
            where CREDIT_ID = '${PARENT_ID}' and 
            CREDIT_PARENT is null and
            ${dateFilter})
            GROUP BY ACCOUNT_ID
            ORDER BY AMOUNT DESC`;
  const query = mainQuery + (type === 'EXPENSE' ? expenseQuery : incomeQuery);
  await db.transaction(tx =>
    tx.executeSql(
      query,
      [],
      (tx, results) => {
        let arr = [] as AccountSum[];
        let sum: number = 0;
        if (results.rows.length === 0) {
          setAccountSum([
            {
              ACCOUNT_ID: '',
              ACCOUNT_NAME: '',
              AMOUNT: 0,
              SYMBOL: '₹',
              color: 'white',
            },
          ]);
        } else {
          for (let i = 0; i < results.rows.length; i++) {
            arr.push({
              ...results.rows.item(i),
              color: colors[i % colors.length],
            });
            sum = sum + results.rows.item(i).AMOUNT;
          }
          setAmountSum(sum);
          setAccountSum(arr);
        }
      },
      err => console.log(err),
    ),
  );
};

export const getIncExpInvData = async (
  date: DateFilter,
  setInc: React.Dispatch<React.SetStateAction<IncExp>>,
  setExp: React.Dispatch<React.SetStateAction<IncExp>>,
  setInv: React.Dispatch<React.SetStateAction<IncExp>>,
) => {
  const now = getDate(new Date(date.year, date.month, 1)); // Take first day of next month
  const lastDate = getDate(new Date(date.year, date.month - 5, 1)); // First day of now - 6 months
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT MMYY, TYPE, AMOUNT FROM
        (SELECT STRFTIME('%m',DATE) || '-' ||STRFTIME('%Y',DATE) AS MMYY, 
        DATE,
        TYPE,
        SUM(AMOUNT) AS AMOUNT
        FROM TRANSACTIONS_VIEW
        WHERE TYPE = 'MAIN' AND
        DATE BETWEEN '${lastDate}' AND
        '${now}' AND
        DEBIT_PARENT = '250377b2-4dda-bf29-e24e-74a4c2100bc8' 
        GROUP BY MMYY,TYPE
        UNION ALL
        SELECT STRFTIME('%m',DATE) || '-' ||STRFTIME('%Y',DATE) AS MMYY, 
        DATE,
        TYPE,
        SUM(AMOUNT) AS AMOUNT
        FROM TRANSACTIONS
        WHERE TYPE != 'MAIN' AND
        DATE BETWEEN '${lastDate}' AND
        '${now}'
        GROUP BY MMYY,TYPE
        )
        ORDER BY DATE`,
      [],
      (tx, results) => {
        let INC: IncExp = {
          labels: [],
          datasets: [{data: []}],
        };
        let EXP: IncExp = {
          labels: [],
          datasets: [{data: []}],
        };
        let INV: IncExp = {
          labels: [],
          datasets: [{data: []}],
        };
        for (let i = 0; i < results.rows.length; i++) {
          if (results.rows.item(i).TYPE === 'INCOME') {
            INC.labels.push(results.rows.item(i).MMYY);
            INC.datasets[0].data.push(results.rows.item(i).AMOUNT);
          } else if (results.rows.item(i).TYPE === 'MAIN') {
            INV.labels.push(results.rows.item(i).MMYY);
            INV.datasets[0].data.push(results.rows.item(i).AMOUNT);
          } else {
            EXP.labels.push(results.rows.item(i).MMYY);
            EXP.datasets[0].data.push(results.rows.item(i).AMOUNT);
          }
        }
        setExp(EXP);
        setInc(INC);
        setInv(INV);
      },
      err => console.log(err),
    ),
  );
};
