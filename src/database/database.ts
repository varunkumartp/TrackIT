// In the react-native-sqlite-storage library folder, go to react-native-config and comment the following part
// ios: {
// 	project: './platforms/ios/SQLite.xcodeproj'
// },
// If this is not commented, database can't be linked to project

import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase(
  {
    name: 'TrackIT.db',
    createFromLocation: '~TrackIT.db',
  },
  () => {},
  () => {},
);
