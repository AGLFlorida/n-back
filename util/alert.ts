import { Alert } from 'react-native';


type alertButtons = {
  ok: string;
  cancel: string;
}


const showCustomAlert = (title: string, message: string, okHandler?: () => void, cancel?: boolean, text?: alertButtons) => {
  const buttons: Array<object> = [{ text: text?.ok || 'OK', onPress: (okHandler) ? okHandler : () => { } }];
  if (cancel) {
    buttons.push(
      { text: text?.cancel || 'cancel', onPress: () => {} }
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