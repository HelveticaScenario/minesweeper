module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testPathIgnorePatterns: ['./.next/', './node_modules/'],
//   globals: {
//     'ts-jest': {
//       tsConfig: 'tsconfig.jest.json'
//     }
//   }
};
