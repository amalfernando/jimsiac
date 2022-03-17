module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.pipeline.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  reporters: [
    'default', [ 'jest-junit', {
      outputDirectory: 'test-reports',
      outputName: 'test-report.xml',
    }]
  ]
};
