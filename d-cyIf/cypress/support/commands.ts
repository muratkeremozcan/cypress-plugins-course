Cypress.Commands.add('clearSurvey', () =>
  cy
    .get('.survey', {timeout: 200})
    .if('visible')
    .find('button')
    .click()
    .else()
    .log('Survey stays hidden')
    .finally()
    .should('not.exist'),
)

Cypress.Commands.add('clearItems', () =>
  cy
    .get('.destroy', {timeout: 400})
    .if('exist')
    .click({force: true, multiple: true})
    .else()
    .log('no items to delete')
    .finally()
    .should('not.exist'),
)

Cypress.Commands.add('visitAndReset', () => {
  cy.visit('/')
  cy.get('#app').should('have.class', 'loaded')

  cy.clearSurvey()

  return cy.clearItems()
})
