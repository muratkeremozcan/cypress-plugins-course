const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'https://angular.realworld.io/',
    supportFile: false,
    fixturesFolder: false,
  },
})
