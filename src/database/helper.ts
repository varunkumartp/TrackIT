import {ResultSet} from 'react-native-sqlite-storage';

export const helper = <T>(
  results: ResultSet,
  setArr: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  let arr: T[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    arr.push(results.rows.item(i));
  }
  setArr(arr);
};
