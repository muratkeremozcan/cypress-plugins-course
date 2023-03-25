// @ts-check

// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

beforeEach(() => {
  cy.log("**log in**");
  cy.visit("/");
  cy.get('[data-test="username"]').type("standard_user");
  cy.get('[data-test="password"]').type("secret_sauce");
  cy.get('[data-test="login-button"]').click();
  cy.location("pathname").should("equal", "/inventory.html");
});

it("has an item with details", () => {
  // load the bike light JSON fixture file
  // https://on.cypress.io/fixture
  //
  // and confirm there is an item in the inventory
  // with the name, description, and price listed in the fixture object
  // https://on.cypress.io/contains
  // https://on.cypress.io/within
  cy.fixture("bike-light.json").then((item) => {
    cy.contains(".inventory_item", item.name).within(() => {
      cy.contains(".inventory_item_desc", item.description);
      cy.contains(".inventory_item_price", item.price);
    });
  });
});
