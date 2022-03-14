module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.pipeline.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
