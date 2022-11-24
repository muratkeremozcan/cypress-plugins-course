const addItem = (text: string) => {
  cy.get('.new-todo').type(`${text}{enter}`);
};

beforeEach(() => {
  // visit the page and make sure it has fully loaded
  cy.visit('/');
  cy.get('#app').should('have.class', 'loaded');

  cy.get('.survey', { timeout: 200 })
    .if('visible')
    .find('button')
    .click()
    .else()
    .log('Survey stays hidden')
    .finally()
    .should('not.exist');

  // Use cypress-if plugin
  // to find all destroy buttons, if they exist
  // and click on each one
  cy.get('.destroy', { timeout: 400 })
    .if('exist')
    .click({ force: true, multiple: true })
    .else()
    .log('no items to delete')
    .finally()
    .should('not.exist');

  // https://on.cypress.io/get
  // https://on.cypress.io/click
  // https://github.com/bahmutov/cypress-if
  // if there are no such buttons
  // print a message "nothing to clean up"
  // in the Cypress Command Log
  // https://on.cypress.io/log
});

it('adds two items starting with zero', () => {
  // this test does not clean up after itself
  // leaving two items for the other test
  addItem('first item');
  addItem('second item');
  cy.get('li.todo').should('have.length', 2);
});
