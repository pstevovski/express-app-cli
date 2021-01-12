module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: ["src/commands/*.ts"],
    collectCoverage: true,
    roots: ["<rootDir>/tests", "<rootDir>/src/commands"]
};