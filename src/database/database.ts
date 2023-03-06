import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'TrackITv6.db',
    createFromLocation: '~TrackITv6.db',
  },
  () => {},
  () => {},
);
