/* eslint-disable no-useless-computed-key */
import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: "coverage",
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleNameMapper: {
    "^@root/(.*)$": "<rootDir>/$1",
    "^@core/(.*)$": "<rootDir>/src/core/$1",
    "^@infra/(.*)$": "<rootDir>/src/infra/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
};

export default jestConfig;
