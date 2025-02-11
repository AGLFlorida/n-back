import { Alert } from 'react-native';


const showCustomAlert = (title: string, message: string, okHandler?: () => void, cancel?: boolean) => {
  const buttons: Array<object> = [{ text: "OK", onPress: (okHandler) ? okHandler : () => { } }];
  if (cancel) {
    buttons.push(
      { text: "Cancel", onPress: () => {} }
    )
  }

  Alert.alert(
    title,
    message,
    buttons,
    { cancelable: true } // Allows dismissing the alert by tapping outside
  );
};

export { showCustomAlert };