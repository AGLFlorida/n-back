import security from '@/util/security';
import * as SecureStore from 'expo-secure-store';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn()
}));

describe('security', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('should successfully save data', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);
      
      const result = await security.set('testKey', { data: 'test' });
      
      expect(result).toBe(true);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify({ data: 'test' })
      );
    });

    it('should handle errors when saving', async () => {
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Save failed'));
      
      const result = await security.set('testKey', { data: 'test' });
      
      expect(result).toBe(false);
    });
  });

  describe('get', () => {
    it('should successfully retrieve data', async () => {
      const mockData = { data: 'test' };
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));
      
      const result = await security.get('testKey');
      
      expect(result).toEqual(mockData);
      expect(SecureStore.getItemAsync).toHaveBeenCalledWith('testKey');
    });

    it('should return null for non-existent data', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(null);
      
      const result = await security.get('testKey');
      
      expect(result).toBeNull();
    });

    it('should handle errors when retrieving', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Retrieval failed'));
      
      const result = await security.get('testKey');
      
      expect(result).toBeNull();
    });
  });
}); 