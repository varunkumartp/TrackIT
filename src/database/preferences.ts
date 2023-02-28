import {db} from './database';

export const setDataSQL = async (key: string, value: {mode: string}) => {
  const data = JSON.stringify(value);
  await db.transaction(tx =>
    tx.executeSql(
      `INSERT INTO PREFERENCES 
                VALUES ('${key}','${data}') 
                ON CONFLICT(KEY) DO 
                UPDATE SET VALUE='${data}' 
                WHERE KEY='${key}'`,
      [],
      () => {},
      err => console.log(err),
    ),
  );
};
