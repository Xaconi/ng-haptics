import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['projects/ng-haptics/src/test-setup.ts'],
    include: ['projects/ng-haptics/src/**/*.spec.ts'],
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['projects/ng-haptics/src/lib/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/index.ts', '**/public-api.ts'],
    },
  },
});
