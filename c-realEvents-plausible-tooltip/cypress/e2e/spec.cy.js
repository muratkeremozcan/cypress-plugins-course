// https://cypress.tips/courses/cypress-plugins/lessons/c8

// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import 'cypress-real-events'

it('shows the tooltip', { scrollBehavior: 'center' }, () => {
  cy.visit('/plausible.io')
  // find the element with "Bounce rate" text
  // and hover over it
  cy.contains('Bounce rate').realHover()
  // the tooltip "Click to show" should appear
  cy.contains('[role=tooltip]', 'bounce rate').should('be.visible')
  // click on the "Bounce rate" and the tooltip
  cy.contains('Bounce rate').click()
  // Then click on some other element
  cy.contains('button', 'Filter').realHover()
  // and the tooltip should go away
  cy.contains('[role=tooltip]', 'bounce rate').should('not.exist')
})
