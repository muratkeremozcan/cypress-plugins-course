# Grep cheat sheet

https://cypress.tips/courses/cypress-plugins/lessons/k1

`npm start`

On another tab run grep commands.

## Setup

Require grep.

Not showing filtered tests and specs is the default desired behavior. Put it in the config file.

```js
// cypress.config.js

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    grepOmitFiltered: true, // recommended
    grepFilterSpecs: true, // recommended
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('@bahmutov/cy-grep/src/plugin')(config) // needed
      return config
    },
    baseUrl: 'http://localhost:8888',
    specPattern: 'cypress/e2e/**/*spec.js',
  },
})
```

Set it up in the support file.

```js
// cypress/support/e2e.js
require('./commands')

const registerCypressGrep = require('@bahmutov/cy-grep')
registerCypressGrep()
```

Tag the tests.

```js
// app-spec.js

describe('TodoMVC - React', { tags: '@add' }, function () {
  it('adds 4 todos', { tags: '@smoke' }, function () {})
  it('multiple tags', { tags: ['@smoke', '@misc'] }, function () {})
})
```

```bash
# test name
yarn cy:open -- --env grep="adds 4 todos"
CYPRESS_grep="adds 4 todos" yarn cy:open # same as above

# tag
yarn cy:open -- --env grepTags=@smoke
yarn cy:open -- --env grepTags=@add
yarn cy:run -- --env grepTags=@misc

## multiple tags ##

# AND logic
yarn cy:run -- --env grepTags=@routing+@someTagA

# OR logic
yarn cy:run -- --env grepTags="@someTagA @someTagB"
yarn cy:run --env grepTags="@routing @persistence"

# OR & AND logic
yarn cy:run -- --env grepTags="@routing+@smoke @persistence+@smoke"

# Burn
yarn cy:run -- --env grep="should allow me to un-mark items as complete",burn=5
yarn cy:run -- --env grepTags=@smoke,burn=3

## MISC ##

# mix string and tag, AND logic
yarn cy:run -- --env grepTags="@uiLogin",grep="cognito",burn=2

# reversion
# filtering by folder or spec file
# runs the tests without 'cognito' in the title, and only the tests in the consumer-app folder
yarn cy:run -- --spec './cypress/e2e/consumer-app/**' --env grep="-cognito"
yarn cy:run -- --spec './cypress/e2e/consumer-app/**' --env grepTags="-@uiLogin"

# run untagged tests
yarn cy:run --env grepUntagged=true

```

Devtool commands https://cypress.tips/courses/cypress-plugins/lessons/k7

```bash
# test name
Cypress.grep('adds items')

# tag
Cypress.grep(null, '@smoke')

# burn
Cypress.grep('adds items', null, 4)

# reset
Cypress.grep()

# run failed tests
Cypress.grepFailed()
```

More in readme https://github.com/cypress-io/cypress/tree/develop/npm/grep#or-tags
