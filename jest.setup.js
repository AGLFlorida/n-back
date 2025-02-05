import 'react-native-gesture-handler/jestSetup';

// Mock the Expo modules that aren't needed in tests
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({ sound: { playAsync: jest.fn() } })
    },
    setAudioModeAsync: jest.fn()
  }
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success'
  }
})); 