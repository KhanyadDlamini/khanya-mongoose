/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: "node",
    transform: {},
    extensionsToTreatAsEsm: [".js"],
    globals: {
        "babel-jest": {
            useESM: true,
        },
    },
};
