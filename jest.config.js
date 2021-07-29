/* eslint-env commonjs, node */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  globals: {
    'ts-jest': {
      tsConfig: {
        compilerOptions: {
          types: ['jest'],
        },
      },
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
}
