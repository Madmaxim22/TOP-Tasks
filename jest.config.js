export default {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: { '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js' },
};