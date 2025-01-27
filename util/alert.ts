import { Alert } from 'react-native';


const showCustomAlert = (title: string, message: string) => {
  Alert.alert(
    title,
    message,
    [
      { text: "OK", onPress: () => { } },
    ],
    { cancelable: true } // Allows dismissing the alert by tapping outside
  );
};