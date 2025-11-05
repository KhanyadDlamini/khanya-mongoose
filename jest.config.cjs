/** @type {import('jest').Config} */
module.exports = {
    // Use Node.js environment since we are testing backend code
    testEnvironment: "node",

    // Match test files
    testMatch: ["**/__tests__/**/*.test.js"],

    // Enable ESM support automatically (because "type": "module" is in package.json)
    transform: {},

    // Verbose test output
    verbose: true,

    // Run tests in serial (optional, sometimes better for DB tests)
    maxWorkers: 1,
};
