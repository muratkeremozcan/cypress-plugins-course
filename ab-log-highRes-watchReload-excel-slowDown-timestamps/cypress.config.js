const { defineConfig } = require('cypress')
// import the the plugin from another file instead
// const registerPlugin = (on) =>
//   on('task', {
//     print(message) {
//       console.log(message)
//       return null
//     },
//   })
// const registerPlugin = require('./log-plugin') // like default import
// const registerPlugin = require('cypress-log-to-term') // instead use cypress-log-to-term plugin
// const registerPlugin = require('cypress-failed-log/on') // instead use cypress-failed-log plugin
const registerPlugin = require('cypress-terminal-report/src/installLogsPrinter') // instead use cypress-terminal-report
const cyHighRes = require('cypress-high-resolution') // increases cy:run screenshot & video resolution
const cyWatchReload = require('cypress-watch-and-reload/plugins') // reloads cypress on src file changes

module.exports = defineConfig({
  // these can be in here, shared by e2e & ct, or in e2e / ct properties
  viewportHeight: 300,
  viewportWidth: 300,
  env: {
    // cypress-high-resolution
    resolution: 'high',
  },
  // cypress-watch-and-reload: list the files and file patterns to watch
  'cypress-watch-and-reload': {
    watch: ['cypress/index.html'],
  },
  // from cypress-slow-down https://github.com/bahmutov/cypress-slow-down
  // commandDelay: 500, // global delay for all commands
  e2e: {
    setupNodeEvents(on, config) {
      return Object.assign(
        {},
        cyWatchReload(on, config),
        cyHighRes(on, config),
        registerPlugin(on),
      )
      // return { ...registerPlugin(on), ...cyHighRes(on, config) }
      // Object.assign may be better in this case https://delicious-insights.com/en/posts/js-object-spread-assign/
    },
  },
})
