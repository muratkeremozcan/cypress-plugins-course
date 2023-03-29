// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import "cypress-map";
chai.use(require("chai-sorted"));

it("sorts item by price", () => {
  cy.visit("/");
  // Tip: grab the username and the password from the login page
  // It is ok for now to hardcode it in the spec source here
  //
  // get the username field and type the standard user
  // https://on.cypress.io/get
  // https://on.cypress.io/type
  cy.get('[data-test="username"]').type("standard_user");
  // get the password field and type the password
  cy.get('[data-test="password"]').type("secret_sauce");
  // get the login button and click on it
  // https://on.cypress.io/click
  cy.get('[data-test="login-button"]').click();
  // you should transition to the inventory page
  // https://on.cypress.io/location
  // see assertion examples at
  // https://glebbahmutov.com/cypress-examples/commands/location.html
  cy.location("pathname").should("equal", "/inventory.html");
  // find the sort dropdown and select the low to high value
  // https://on.cypress.io/select
  // Tip: inspect the HTML markup around the sort element
  cy.get('[data-test="product_sort_container"]').select("lohi");

  // find all price elements and map them to numbers
  // following the "Lesson 02" solution
  // Tip: use cypress-map queries

  // confirm the list of numbers is sorted
  // https://on.cypress.io/should
  // Tip: write a should(callback) function
  // that sorts the list and confirms the passed list
  // and the sorted are the same

  cy.get(".inventory_item_price")
    .map("innerText")
    .mapInvoke("substring", 1)
    .map(Number)
    .should("be.sorted");
  // .should('be.ascending') // same as above

  // non chai version
  const isSorted = (value, index, array) =>
    index === 0 || value >= array[index - 1];
  cy.get(".inventory_item_price")
    .map("innerText")
    .mapInvoke("substring", 1)
    .map(Number)
    .invoke("every", isSorted)
    .should("eq", true);

  // non chai version 2
  cy.get(".inventory_item_price")
    .map("innerText")
    .mapInvoke("substring", 1)
    .map(Number)
    .should((numbers) => {
      const sorted = numbers.sort((a, b) => a - b); //?
      expect(sorted).to.deep.eq(numbers);

      // version 3
      const sortedLodash = Cypress._.sortBy(numbers);
      // console.log(sortedLodash.reverse()) // if you wanted to reverse the order
      expect(sortedLodash).to.deep.eq(numbers);
    });
});

// Bonus: rewrite the above test using chai-sorted assertion
