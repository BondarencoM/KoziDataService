// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  modulePathIgnorePatterns: ["globalConfig.json"],
  preset: '@shelf/jest-mongodb',
};
