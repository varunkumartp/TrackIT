// import React from 'react';
import SQLite from 'react-native-sqlite-storage';
// import uuid from 'react-native-uuid';

export const db = SQLite.openDatabase(
  {
    name: 'TrackIT.db',
    createFromLocation: '~TrackIT.db',
  },
  () => {},
  err => {
    console.log(err);
  },
);
