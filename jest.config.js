module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo(nent)?|@expo(nent)?/.*|expo-.*|react-clone-referenced-element|react-native-vector-icons|@react-navigation)/)',
  ],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};


