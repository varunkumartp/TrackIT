import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'TrackITv2.db',
    createFromLocation: '~TrackITv2.db',
  },
  () => {},
  err => {
    console.log(err);
  },
);
