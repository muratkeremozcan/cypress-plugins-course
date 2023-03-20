// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

// https://cypress.tips/courses/network-testing/lessons/bonus68

// The application running at https://angular.realworld.io/ implements client-side routing.
// Thus from the homepage you can click on the "Sign up" link and visit the /register page.
// But if you try to visit the https://angular.realworld.io/register directly, the browser will show 404 error.
// https://glebbahmutov.com/blog/routing-with-fallback/
// In order to solve this problem, the server has to catch stray requests like GET /register and return the index.html page.
// Then the application will pick up the location /register and will serve the right view client-side.

// workaround to direct nav problem; implement a routing fallback using cy.intercept
it('visits the /register page', () => {
  // we will need the HTML of the index page beforehand
  cy.request('/')
    .its('body')
    .then((html) => {
      // intercept the "GET /register" call and return the HTML
      // of the index page. The client-side routing will load
      // and work based on the browser url "/register"
      cy.intercept('GET', '/register', (req) => {
        req.reply(html)
      })
    })
  // visit the /register page
  cy.visit('/register')
})
