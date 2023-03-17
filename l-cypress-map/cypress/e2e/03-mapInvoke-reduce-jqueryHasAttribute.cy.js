/// <reference types="cypress" />

import 'cypress-map'
const { _, $ } = Cypress
it('counts the number of elements with data-selected attribute', () => {
  cy.visit('cypress/fixtures/prices-list.html')
  // get the price LI elements
  // ask each element if it has attribute "data-selected"
  // convert the "true/false" into 1/0 numbers
  // and then count all "1"s by using reduce
  // and the total sum should be 2
  // https://on.cypress.io/get
  // mapInvoke, map, reduce
  cy.get('#prices li')
    .mapInvoke('hasAttribute', 'data-selected')
    .map(Number)
    .reduce(Cypress._.add, 0)
    .should('equal', 2)

  // same thing
  cy.get('#prices li[data-selected]').should('have.length', 2)
})
