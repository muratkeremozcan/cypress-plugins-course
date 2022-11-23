const { defineConfig } = require('cypress')
const clipboardy = require('clipboardy')

// using a separate function
const registerPlugin = (on) =>
  on('task', {
    // readClipboard() {
    //   return clipboardy.readSync()
    // },
    // readClipboard: () => clipboardy.readSync()
    readClipboard: clipboardy.readSync,
  })

module.exports = defineConfig({
  e2e: {
    // baseUrl, etc
    baseUrl: 'https://github.com',
    supportFile: false,
    fixturesFolder: false,
    viewportHeight: 1000,
    setupNodeEvents(on, config) {
      // use function instead
      // on('task', {
      //   readClipboard() {
      //     const s = clipboardy.readSync()
      //     return s
      //   },
      // })
      registerPlugin(on)
    },
  },
})
