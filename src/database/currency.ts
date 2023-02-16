import {db} from './database';

export const readCurrency = async (
  setCurrency: React.Dispatch<React.SetStateAction<readCurrency>>,
) => {
  await db.transaction(tx =>
    tx.executeSql(
      `SELECT * FROM CURRENCIES ORDER BY NAME`,
      [],
      (tx, results) => {
        let arr = [] as readCurrency;
        let prevHeader = '';

        for (let i = 0; i < results.rows.length; i++) {
          let header = results.rows.item(i).NAME[0];
          if (prevHeader !== header) {
            prevHeader = header;
            arr.push({title: header, data: []});
          }
          arr[arr.length - 1].data.push(results.rows.item(i));
        }
        setCurrency(arr);
      },
      err => console.log(err),
    ),
  );
};
