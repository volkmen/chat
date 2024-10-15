/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}]
  },
  rootDir: 'src',
  moduleNameMapper: {
    // Example: Map `@components` to the actual path
    // resolvers: 'src/resolvers'
    '^entities/(.*)$': '<rootDir>/entities/$1',
    '^resolvers/(.*)$': '<rootDir>/resolvers/$1'
  }
};
