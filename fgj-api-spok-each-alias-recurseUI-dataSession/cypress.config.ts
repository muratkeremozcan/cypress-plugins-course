import { defineConfig } from 'cypress'
// @ts-ignore
const registerDataSession = require('cypress-data-session/src/plugin')

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    setupNodeEvents(on, config) {
      registerDataSession(on, config)
    },
  },
})
