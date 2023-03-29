// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import "cypress-map";

// https://www.chaijs.com/plugins/chai-sorted/
// @ts-ignore
chai.use(require("chai-sorted"));

const login = (name, password) => {
  cy.visit("/");
  cy.get('[data-test="username"]').type(name);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  cy.location("pathname").should("equal", "/inventory.html");
};

Cypress.Commands.add("sessionLogin", (name, password) => {
  cy.session({ name, password }, () => login(name, password), {
    validate: () =>
      cy.getCookie("session-username").its("value").should("eq", name),
    cacheAcrossSpecs: true,
  });
  return cy.visit("/inventory.html");
});

describe("sorting", () => {
  beforeEach(() => {
    cy.sessionLogin("standard_user", "secret_sauce");
  });

  /**
   * Sorts item by price or name
   * @param {'lohi'|'hilo'|'az'|'za'} order
   */
  function sortBy(order) {
    // confirm the argument value at runtime
    expect(order, "sort order").to.be.oneOf(["lohi", "hilo", "az", "za"]);
    cy.log(`**sort by ${order}**`);
    cy.get('[data-test="product_sort_container"]').select(order);
  }

  function getPrices() {
    return cy
      .get(".inventory_item_price")
      .map("innerText")
      .mapInvoke("slice", 1)
      .map(Number)
      .print("sorted prices %o");
  }

  function getNames() {
    return cy.get(".inventory_item_name").map("innerText").print("items %o");
  }

  it("by price lowest to highest", () => {
    sortBy("lohi");
    getPrices().should("be.ascending");
  });

  it("by price highest to highest", () => {
    sortBy("hilo");
    // confirm the item prices are sorted from highest to lowest
    getPrices().should("be.descending");
  });

  it("by name from A to Z", () => {
    sortBy("az");
    getNames().should("be.ascending");
  });

  it("by name from Z to A", () => {
    sortBy("za");
    getNames().should("be.descending");
  });
});
