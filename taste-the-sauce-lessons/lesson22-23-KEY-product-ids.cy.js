// @ts-check

// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import { LoginPage } from "./login.page";
const { _ } = Cypress;
const { map, pipe, pluck, invoker } = require("ramda");
import "cypress-map";

describe("Products", () => {
  // create a small type on the fly using jsdoc comment
  // just to help type check help us
  /** @type {{username: string, password: string}} */
  const user = Cypress.env("users").standard;
  // we can even check if the user object is valid
  if (!user) {
    throw new Error("Missing the standard user");
  }

  // before each test, quickly login the user
  // or restore the previous user session
  beforeEach(() => {
    LoginPage.login(user.username, user.password);
    cy.visit("/inventory.html");
    cy.location("pathname").should("equal", "/inventory.html");
  });

  it("have unique ids", () => {
    // get all inventory items, there should be more than 3
    // https://on.cypress.io/get
    // https://on.cypress.io/should
    //
    // from each element, get the attribute "data-itemid"
    // and confirm the ids are unique
    // https://on.cypress.io/invoke
    // https://glebbahmutov.com/cypress-examples
    cy.get(".inventory_item")
      .should("have.length.gt", 3)
      .invoke("toArray")
      // .then((els) => els.map((el) => el.getAttribute('data-itemid'))) // vanilla js
      // .then((els) => _.map(els, (el) => el.getAttribute('data-itemid'))) // lodash
      // .then(map((el) => el.getAttribute('data-itemid'))) // ramda
      .map((el) => el.getAttribute("data-itemid")) // cypress-map
      .should((ids) => {
        expect(ids).to.deep.equal(_.uniq(ids));
      });

    // better version (lesson 23)
    cy.get(".inventory_item")
      .should("have.length.gt", 3)
      .mapInvoke("getAttribute", "data-itemid")
      .should((ids) => {
        expect(ids).to.deep.equal(_.uniq(ids));
      });
  });
});
