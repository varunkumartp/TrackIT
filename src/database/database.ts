// import React from 'react';
import SQLite from 'react-native-sqlite-storage';
// import uuid from 'react-native-uuid';

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
