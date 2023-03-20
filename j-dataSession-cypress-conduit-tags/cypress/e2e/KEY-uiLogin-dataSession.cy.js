// https://cypress.tips/courses/cypress-plugins/lessons/j6

import 'cypress-data-session'

// The test creates a new user before EACH test, which is both slow and unwieldy.
// Sometimes you want to reuse the same created user in several tests.

// how does the page "stay" logged in?
// inspect the DevTools application tab to find out
// Can you preserve the main information in the data session:
// the username, the email, the password, and whatever
// information is necessary to recreate the logged in state

const registerUser = () => {
  const username = `cy-${Cypress._.random(1e6)}`
  const email = username + '@acme.co'
  const password = `!secret-${Cypress._.random(1e6)}`
  // because the routing in this application is client-side
  // we cannot directly visit the /register page
  // and instead must go from the home page
  cy.visit('/')
  cy.contains('a', 'Sign up').click()
  cy.location('pathname').should('equal', '/register')
  // fill the sign up form
  cy.get('input[placeholder=Username]').type(username)
  cy.get('input[placeholder=Email]').type(email)
  cy.get('input[placeholder=Password]').type(password)
  cy.contains('button', 'Sign up').click()
  // we should end up back on the home page
  cy.location('pathname').should('equal', '/')
  // // and we should be logged in
  cy.contains('a.nav-link', username).should('be.visible')

  // how does the page "stay" logged in?
  // inspect the DevTools application tab to find out
  // Can you preserve the main information in the data session:
  // the username, the email, the password, and whatever
  // information is necessary to recreate the logged in state

  return cy.window().its('localStorage').invoke('getItem', 'jwtToken')
}

beforeEach(() => {
  cy.dataSession({
    name: 'user',
    setup: registerUser,
    // validate: true, // validate is optional, if left out it's true by default
    // when validate is true, recreate is run
    // therefore recreate is only not run on initial execution, where there is no cache so validate cannot be true
    recreate: (token) => {
      cy.window().its('localStorage').invoke('setItem', 'jwtToken', token)
      return cy.visit('/')
    },
    // cacheAcrossSpecs: true,
  })
})

// the test should start at the home page
// and immediately be logged in
it('is logged in', function () {
  cy.location('pathname').should('equal', '/')
  // we can check if the user is logged in by confirming
  // the profile navigation link is there
  // cy.contains('a.nav-link', this.user.username).should('be.visible')
})
