import { defineConfig } from "vitest/config";

export const createVitestConfig = () =>
  defineConfig({
    test: {
      globals: true,
      environment: "node",
      coverage: {
        reporter: ["text", "html"]
      }
    }
  });
