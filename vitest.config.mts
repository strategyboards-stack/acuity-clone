import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'node'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./apps/web', import.meta.url))
    }
  }
});
