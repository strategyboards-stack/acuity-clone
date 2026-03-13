export const REQUIRED_TEST_ENV = ["NODE_ENV"];

export function assertTestEnv() {
  for (const key of REQUIRED_TEST_ENV) {
    if (!process.env[key]) {
      process.env[key] = "test";
    }
  }
}
