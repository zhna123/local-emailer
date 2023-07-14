
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: jest.fn(async (key, callback) => {
                return 'Mac'
             })
  }
});