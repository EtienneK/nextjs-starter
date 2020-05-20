module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["./jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json"
    }
  }
};
