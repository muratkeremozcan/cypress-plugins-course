it('opens the settings dialog', () => {
  cy.visit('/');
  cy.get('dialog.settings').should('not.be.visible');
  cy.get('button.toggle-settings').click();
  cy.get('dialog.settings')
    .should('be.visible')
    // wait a second to make the dialog visible to the user
    .wait(1000, { log: false });
  cy.get('button.toggle-settings').click();
  cy.get('dialog.settings').should('not.be.visible');
});
