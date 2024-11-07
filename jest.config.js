/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
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
