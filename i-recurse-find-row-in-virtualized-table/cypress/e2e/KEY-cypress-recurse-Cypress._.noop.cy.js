// https://cypress.tips/courses/cypress-plugins/lessons/i7

/// <reference types="cypress" />

import { recurse } from 'cypress-recurse'

it('finds the row by scrolling', () => {
  cy.visit('/')
  // find the row with the text "Rough Rice"
  // if the row is not there, grab the last row currently present
  // and scroll it into view - this will force Material UI code
  // to create new rows and insert them into the DOM
  // Tip: use cypress-recurse to check if the row is there
  // and scroll the last row
  recurse(
    () => cy.contains('[role=row]', 'Rough Rice').should(Cypress._.noop),
    ($row) => $row.length,
    {
      log: false,
      timeout: 20_000,
      delay: 1_000,
      post() {
        cy.get('[role=row]:last').scrollIntoView()
      },
    },
  )
    // once the row is found, "recurse" yields it
    // and you can scroll it into view and confirm you found
    // the right row
    .scrollIntoView()
    .should('be.visible')
    .and('have.attr', 'data-rowindex', '21')
})
