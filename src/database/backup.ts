import RNFS from 'react-native-fs';
import DocPicker from 'react-native-document-picker';
import {PermissionsAndroid} from 'react-native';
import RNRestart from 'react-native-restart';
import {ToastAndroid} from 'react-native';

const showToastWithGravity = (message: string) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
};

function formatDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    mins = d.getMinutes();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day, hour, mins].join('');
}

export const backupDB = async () => {
  try {
    const destPath =
      RNFS.DownloadDirectoryPath + '/TrackIT_Backup_' + formatDate() + '.trit';
    await RNFS.copyFile(
      '/data/data/com.trackit/databases/TrackITv3.db',
      destPath,
    );
    showToastWithGravity('Data backup file downloaded to Downloads folder');
  } catch (e) {
    console.log(e);
  }
};
