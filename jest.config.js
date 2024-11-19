/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/configs/jest.setup.ts'],
  globalTeardown: '<rootDir>/tests/configs/jest.teardown.ts',
  globalSetup: '<rootDir>/tests/configs/jest.globalSetup.ts',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },
  rootDir: 'src',
  moduleNameMapper: {
    // Example: Map `@components` to the actual path
    // resolvers: 'src/resolvers'
    '^entities/(.*)$': '<rootDir>/entities/$1',
    '^resolvers/(.*)$': '<rootDir>/resolvers/$1',
    '^utils/(.*)$': '<rootDir>/utils/$1'
  }
};
