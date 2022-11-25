/// <reference types="cypress" />
import { resetDatabase } from './utils'

import spok from 'cy-spok'
import todos from '../fixtures/example.json'

describe('Todo', () => {
  beforeEach(() => {
    resetDatabase(todos)
  })

  it('adds a todo', () => {
    cy.visit(
      '/?type=completed&n=4&start_id=201&_cache_bust=' + Cypress._.random(1e6),
    )
    cy.location('search')
      .should('include', 'type=completed&n=4&start_id=201&_cache_bust=')
      // TODO: implement the cy.then callback
      // to convert the search string into a plain object
      // URL search converted to a plain object
      .then((searchStr) => new URLSearchParams(searchStr))
      .invoke('entries')
      .then(Array.from)
      .then(Cypress._.fromPairs)
      .then(console.log)
      // (yuck) convert the strings to number for meaningful assertions
      // (yuck) Using _.update we are mutating the original object, thus no need to even return it from the cy.then(callback)
      // .then((o) => {
      // convert "n" to a number
      // convert "start_id" to a number
      //   Cypress._.update(o, 'n', Number)
      //   Cypress._.update(o, 'start_id', Number)
      // })
      .should(
        spok({
          type: (s) => ['active', 'completed'].includes(s),
          n: `${todos.length}`,
          start_id: '201',
          _cache_bust: spok.string,
        }),
      )
      // demo: spok still yields the original object
      .and(
        spok({
          type: (s) => ['active', 'completed'].includes(s),
          n: `${todos.length}`,
          start_id: '201',
          _cache_bust: spok.string,
        }),
      )
  })
})
