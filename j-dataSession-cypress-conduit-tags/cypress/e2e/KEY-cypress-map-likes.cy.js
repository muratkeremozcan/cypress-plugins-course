// https://cypress.tips/courses/network-testing/lessons/bonus67

// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

import 'cypress-map'
import { map, prop } from 'ramda'
const { _ } = Cypress

it('confirms the number of likes on each article', () => {
  // intercept the articles returned by the server
  cy.intercept({
    method: 'GET',
    hostname: 'api.realworld.io',
    pathname: '/api/articles',
  }).as('articles')
  cy.visit('/')
  // wait for the articles to load
  // and get the list of articles from the server's response
  // cy.wait('@articles').its('response.body.articles.0').print() // we can instead chain like below
  //
  // print the first article using cy.print
  // https://github.com/bahmutov/cypress-map
  //
  // map the list of articles into the list of favorites counts
  // and print it to the Command Log
  // cypress-map vs vanillaJS vs lodash vs ramda
  cy.get('@articles')
    .its('response.body.articles')
    .print((list) => list[0])
    // .print() // Article[], [{..}, {..}]
    // .then((articles) => articles.map((a) => a.favoritesCount)) // vanillaJS version
    // .then((articles) => _.map(articles, (a) => a.favoritesCount)) // lodash version
    // .then(map((a) => a.favoritesCount)) // ramda version
    // .then(map(prop('favoritesCount'))) // ramda short version
    // .then(pluck('favoritesCount')) // ramda shorter version
    // .map((a) => a.favoritesCount) // cypress-map long version
    .map('favoritesCount') // cypress-map short better
    // .print() // Number[]
    .should('be.an', 'array')
    .and('have.length.gt', 0)
    .each((articleCount) => expect(articleCount).to.be.within(1, 1000))
  // .should((counts) => counts.forEach((n) => expect(n).to.be.within(1, 1000))) // other version

  //
  // confirm each count is between 1 and 1000
})
