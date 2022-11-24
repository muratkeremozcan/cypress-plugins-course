before(() => {
  cy.visitAndReset();
});

const ensureSettingsClosed = () => {
  cy.get('dialog.settings', { timeout: 5000 })
    .if('visible')
    .get('button.toggle-settings')
    .click();

  return cy.get('dialog.settings').should('not.be.visible');
};

it('opens the settings dialog', () => {
  ensureSettingsClosed();

  cy.get('dialog.settings').should('not.be.visible');
  cy.get('button.toggle-settings').click();

  cy.get('dialog.settings')
    .should('be.visible')
    // wait a second to make the dialog visible to the user
    .wait(1000, { log: false })
    // maybe validate something inside the dialog
    .contains('Settings');
});

it('closes the settings dialog', () => {
  ensureSettingsClosed();

  cy.get('button.toggle-settings').click();
  cy.get('dialog.settings').should('be.visible');

  cy.get('button.toggle-settings').click();
  cy.get('dialog.settings').should('not.be.visible');
});
