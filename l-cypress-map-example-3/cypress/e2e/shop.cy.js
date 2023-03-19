/// <reference types="cypress" />

import 'cypress-map'
const { _ } = Cypress

it('has the price attributes cypress-map solution', () => {
  // intercept the "GET /items" network call the application is making
  // using the fixture "items.json"
  // https://on.cypress.io/intercept
  // give the intercept an alias "items"

  cy.intercept('GET', '/items', { fixture: 'items.json' }).as('getItems')
  // visit the local file
  cy.visit('cypress/shop.html')
  // confirm the intercept works
  // https://on.cypress.io/wait
  cy.wait('@getItems')
  //
  // load the same items from the fixture "items.json"
  // and extract the property "price" from each item
  // https://on.cypress.io/fixture

  //
  // get the items from the list on the page
  // https://on.cypress.io/get
  // and from each element get its "data-price" attribute
  // convert the strings to numbers
  // and confirm all prices from the fixture are there
  // Tip: sort the lists before comparing,
  // since the application is sorting the items by name
  cy.fixture('items')
    .map('price')
    .then((fItems) =>
      cy
        .get('#items [data-price]')
        .mapInvoke('getAttribute', 'data-price')
        .map(Number)
        .invoke('sort')
        .should('deep.eq', fItems.sort()),
    )
})

it.only('has the price attributes vanilla solution', () => {
  // intercept the "GET /items" network call the application is making
  // using the fixture "items.json"
  // https://on.cypress.io/intercept
  // give the intercept an alias "items"

  cy.intercept('GET', '/items', { fixture: 'items.json' }).as('getItems')
  // visit the local file
  cy.visit('cypress/shop.html')
  // confirm the intercept works
  // https://on.cypress.io/wait
  cy.wait('@getItems')
  //
  // load the same items from the fixture "items.json"
  // and extract the property "price" from each item
  // https://on.cypress.io/fixture

  //
  // get the items from the list on the page
  // https://on.cypress.io/get
  // and from each element get its "data-price" attribute
  // convert the strings to numbers
  // and confirm all prices from the fixture are there
  // Tip: sort the lists before comparing,
  // since the application is sorting the items by name
  cy.fixture('items')
    // .map('price')
    .then((fItems) => {
      const prices = _.map(fItems, 'price').sort()

      cy.get('#items [data-price]').should(($li) => {
        const attributes = Cypress._.map($li, (li) =>
          li.getAttribute('data-price'),
        )
          .map(Number)
          .sort()

        expect(attributes, 'prices').to.deep.equal(prices)
      })
    })
})
