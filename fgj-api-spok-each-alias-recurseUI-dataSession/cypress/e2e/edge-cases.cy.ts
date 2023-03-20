// import an API plugin if plan to use something
// other than cy.request command
// import cypress-each plugin
// https://github.com/bahmutov/cypress-each
import 'cypress-plugin-api'
import 'cypress-each'

// this is the list of title edge cases we want to
// create on the backend. Some of these are impossible
// to create through the page UI itself
const invalidTodos = {
  empty: {
    title: '',
  },
  whitespace: {
    title: '  ',
  },
  emoji: {
    title: '🤣🎉',
  },
}

// we want an array
/*
[
  [
      "empty",
      {
          "title": ""
      }
  ],
  [
      "whitespace",
      {
          "title": "  "
      }
  ],
  [
      "emoji",
      {
          "title": "🤣🎉"
      }
  ]
]
*/

const testData = Cypress._.toPairs(invalidTodos)

// before each test, reset the backend data
// by making a "POST /reset" call with "todos: []"

// for each edge case, write a test that
// creates a single todo item by making a "POST /todos" API call
// then the test should visit the home page "/"
// and confirm there is only one todo shown
// and the label text is exactly the same as
// what we used to create the todo
//
// Tip: cypress-each automatically splits an array argument
// into individual arguments passed to the test callback function

beforeEach(() => {
  cy.api('POST', '/reset', { todos: [] })
})

// it.each(testData)('for case %s', (caseName, todo) => {
it.each(testData)(
  ([caseName, todo]) =>
    `for case ${caseName} ${todo.title}`,
  // cypress-each splits the array argument
  (caseName, todo) => {
    cy.log(`creating todo with ${caseName} title`)
    cy.log(todo)
    cy.api('POST', '/todos', todo)
    cy.visit('/')
    cy.get('label')
      .should('have.length', 1)
      .and('have.text', todo.title) // checking an empty string cannot use contains
  },
)
