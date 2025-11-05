/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".js"],
    testMatch: ["**/test.js"],  // <-- include the file path
    transform: {},
};
