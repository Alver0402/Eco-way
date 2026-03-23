module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  // Usar archivos compilados
  roots: ['<rootDir>/dist', '<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        target: 'ES2019',
      },
    }],
  },
  // Evitar conflictos
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
