/// <reference types="cypress" />

import 'cypress-map'

beforeEach(() => cy.visit('cypress/fixtures/json-attribute.html'))
it('confirms the attribute age', () => {
  // find the element with id "person"
  // it should have an attribute "data-field"
  // inside should be a stringified JSON object
  // with property 'age: 10'
  // cy.get('#person').should('have.attr', 'data-field', '{"name":"Joe","age":10}')

  cy.get('#person')
    .should('have.attr', 'data-field')
    .and((s) => {
      // cannot use then because it doesn't have retry
      // this is the best we can do for retry ability
      const o = JSON.parse(s)
      expect(o, 'parsed').to.have.property('age', 10)
    })
})
/*
difference between getAttribute, attr

// vanilla JavaScript
const element = document.getElementById('my-element');
const value = element.getAttribute('data-my-attribute');

// getAttribute is a JS method
const value = $('#my-element')[0].getAttribute('data-my-attribute');

// attr is a jQuery method, gets the 0th element automatically
const value = $('#my-element').attr('data-my-attribute');

https://glebbahmutov.com/cypress-examples/recipes/element-attributes.html

*/

it('cypress-map version', () => {
  cy.get('#person')
    .invoke('attr', 'data-field')
    .should('deep.eq', '{"name":"Joe","age":10}')

  cy.get('#person')
    // .its(0) // getAttribute gets the whole jQuery object, that's why we need the 0th
    // .invoke('getAttribute', 'data-field')
    .invoke('attr', 'data-field') // attr gets the 0th element automatically
    .apply(JSON.parse) // apply is like a then that retries the chain
    .its('age')
    .should('eq', 10)
})
