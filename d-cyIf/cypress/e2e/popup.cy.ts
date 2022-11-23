it('loads the page', () => {
  cy.visit('/');
  cy.get('#app').should('have.class', 'loaded');
  cy.get('.new-todo').type('Write code{enter}');
});
