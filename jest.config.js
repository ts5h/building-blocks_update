/** @type {import ('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '/^.+\.module\.(css|sass|scss)$/': 'identity-obj-proxy',
  }
}