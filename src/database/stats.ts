import {db} from './database';

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
  const dateFilter =
    date.month === -1
      ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
      : date.month !== 0
      ? `strftime('%m', DATE) = '${date.month.toString().padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
      : `strftime('%Y', DATE) = '${date.year}'`;

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
  const dateFilter =
    date.month === -1
      ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
      : date.month !== 0
      ? `strftime('%m', DATE) = '${date.month.toString().padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
      : `strftime('%Y', DATE) = '${date.year}'`;

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
  const dateFilter =
    date.month === -1
      ? `DATE BETWEEN '${date.year - 1}-04-01' and '${date.year}-04-01'`
      : date.month !== 0
      ? `strftime('%m', DATE) = '${date.month.toString().padStart(2, '0')}' AND
               strftime('%Y', DATE) = '${date.year}'`
      : `strftime('%Y', DATE) = '${date.year}'`;

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
