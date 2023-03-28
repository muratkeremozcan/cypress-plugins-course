// @ts-ignore
Cypress.Commands.add(
  "fillForm",
  // @ts-ignore
  { prevSubject: "element" },
  ($form, inputs) => {
    cy.wrap($form, { log: false }).within(() => {
      // iterate over the input fields
      // and type into each selector (key) the value
      Cypress._.forEach(inputs, (value, selector) => {
        cy.get(selector).type(value);
      });
    });
  }
);

Cypress.Commands.add(
  "fillFormInitial",
  { prevSubject: "element" },
  ($form, first, last, zip) => {
    // fill the checkout information form
    cy.wrap($form, { log: false }).within(() => {
      cy.get("#first-name").type(first);
      cy.get("#last-name").type(last);
      cy.get("#postal-code").type(zip);
    });
    // the command yields the result of the last command
    // which is cy.within which yields its subject,
    // thus this command yields the form element!
  }
);
