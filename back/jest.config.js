module.exports = {
  clearMocks: true,
  coverageDirectory: "build/coverage",
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: false,
  // testMatch: ["**/tests/**/*.spec.ts"],
  testMatch: ["**/**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/app/$1",
  },
};
