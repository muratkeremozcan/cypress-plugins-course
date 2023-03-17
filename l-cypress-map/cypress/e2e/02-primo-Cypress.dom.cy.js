/// <reference types="cypress" />

import 'cypress-map'

it('gets the raw DOM element at position k', () => {
  cy.visit('cypress/fixtures/prices-list.html')
  // get the prices LI elements
  // and confirm it is a jQuery object
  // https://on.cypress.io/get
  // "should satisfy" assertion
  // https://glebbahmutov.com/cypress-examples/commands/assertions.html
  // https://on.cypress.io/dom
  cy.get('#prices li')
    .should('satisfy', Cypress.dom.isJquery)
    // yield the first element
    // https://on.cypress.io/eq
    // https://on.cypress.io/first
    // and confirm it is _still_ a jQuery object
    .first()
    .should('satisfy', Cypress.dom.isJquery)

  // Now change the standard Cypress queries to cypress-map
  // and confirm they yield the DOM elements
  cy.get('#prices li')
    .should('satisfy', Cypress.dom.isJquery)
    // .at(0) // or ".primo()"
    .primo()
    .should('satisfy', Cypress.dom.isElement)
    .and('have.property', 'innerText', 'Oranges $0.99')
})
