// const { pathsToModuleNameMapper } = require('ts-jest');
// const { compilerOptions } = require('./tsconfig.json');

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
//   moduleNameMapping: {
//     ...(compilerOptions.paths
//       ? pathsToModuleNameMapper(compilerOptions.paths, {
//           prefix: '<rootDir>/'
//         })
//       : {}),
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
//   },
//   transform: {
//     '^.+.(ts|tsx)$': 'ts-jest'
//   },
//   testMatch: [
//     '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
//     '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx)'
//   ],
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
//   collectCoverageFrom: [
//     'src/**/*.{ts,tsx}',
//     '!src/index.tsx',
//     '!src/reportWebVitals.ts'
//   ]
// };

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  moduleNameMapping: {
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@pages(.*)': '<rootDir>/src/pages/$1',
    '@components(.*)': '<rootDir>/src/components/$1',
    '@ui(.*)': '<rootDir>/src/components/ui/$1',
    '@ui-pages(.*)': '<rootDir>/src/components/ui/pages/$1', 
    '@utils-types(.*)': '<rootDir>/src/utils/types/$1',
    '@slices(.*)': '<rootDir>/src/slices/$1',
    '@selectors(.*)': '<rootDir>/src/selectors/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  transform: {
    '^.+.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
