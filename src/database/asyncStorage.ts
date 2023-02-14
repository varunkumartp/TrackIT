import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key: string, value: {mode: string}) => {
  try {
    const JSONValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, JSONValue);
  } catch ({message}) {
    console.log(message);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch ({message}) {
    console.log(message);
  }
};
