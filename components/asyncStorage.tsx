import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@authToken', token);
  } catch (e) {
    console.error(e);
  }
};

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@authToken');
    return token;
  } catch (e) {
    console.error(e);
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('@authToken');
  } catch (e) {
    console.error(e);
  }
};
