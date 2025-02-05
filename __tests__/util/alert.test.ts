import { Alert } from 'react-native';
import { showCustomAlert } from '@/util/alert';

// Mock React Native's Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn()
  }
}));

describe('alert', () => {
  beforeEach(() => {
    // Clear mock before each test
    (Alert.alert as jest.Mock).mockClear();
  });

  describe('showCustomAlert', () => {
    it('should call Alert.alert with correct parameters', () => {
      const title = 'Test Title';
      const message = 'Test Message';
      
      showCustomAlert(title, message);
      
      expect(Alert.alert).toHaveBeenCalledWith(
        title,
        message,
        [
          { text: "OK", onPress: expect.any(Function) }
        ],
        { cancelable: true }
      );
    });

    it('should be called with different messages', () => {
      showCustomAlert('Title 1', 'Message 1');
      showCustomAlert('Title 2', 'Message 2');
      
      expect(Alert.alert).toHaveBeenCalledTimes(2);
      expect(Alert.alert).toHaveBeenNthCalledWith(
        1,
        'Title 1',
        'Message 1',
        expect.any(Array),
        expect.any(Object)
      );
      expect(Alert.alert).toHaveBeenNthCalledWith(
        2,
        'Title 2',
        'Message 2',
        expect.any(Array),
        expect.any(Object)
      );
    });
  });
}); 