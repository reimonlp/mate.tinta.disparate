import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
