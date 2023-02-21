import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'TrackITv3.db',
    createFromLocation: '~TrackITv3.db',
  },
  () => {},
  err => {
    console.log(err);
  },
);
