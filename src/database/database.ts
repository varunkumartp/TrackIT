import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'TrackIT.db',
    createFromLocation: '~TrackIT.db',
  },
  () => {},
  () => {},
);
