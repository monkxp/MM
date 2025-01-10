// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^../lib/supabaseClient$": "<rootDir>/src/lib/__mocks__/supabaseClient.ts",
  },
};
