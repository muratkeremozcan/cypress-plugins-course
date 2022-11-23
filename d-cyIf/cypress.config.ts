import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9100',
    env: {
      api: 'http://localhost:3000'
    },
    viewportWidth: 1000,
    viewportHeight: 1000
  }
});
