/* eslint-disable */
export default {
    displayName: 'Carte au trésor',
    clearMocks: true,
    coverageDirectory: 'coverage',
    globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } },
    moduleFileExtensions: [ 'js', 'json', 'ts' ],
    testEnvironment: 'node',
    testMatch: [ '**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts' ],
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    maxWorkers: 1,
    testTimeout: 30000,
};
