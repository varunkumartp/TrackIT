import EncryptedStorage from 'react-native-encrypted-storage';

export async function setData(key: string, value: {mode: string}) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export async function getData(key: string) {
  try {
    const value = await EncryptedStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.log(error);
  }
}
