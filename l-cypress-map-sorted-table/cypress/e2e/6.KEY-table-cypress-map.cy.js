/// <reference types="cypress" />

// https://github.com/bahmutov/cypress-map
import 'cypress-map'

// https://www.chaijs.com/plugins/chai-sorted/
chai.use(require('chai-sorted'))
const { $, _ } = Cypress
const { pluck, pipe, map } = require('ramda')

beforeEach(() => {
  cy.visit('app/table.html')
})

it('confirms the headings: compare map array, lodash, ramda, cypress-map', () => {
  // can you confirm the table has the following headings?
  const headings = ['Name', 'Date (YYYY-MM-DD)', 'Age']

  // JS array.map version (built-in)
  cy.get('thead > tr >')
    .then(($tr) => $.makeArray($tr).map(($td) => $td.innerText))
    .should('deep.eq', headings)

  // lodash works with objects as it would with arrays, and has a property shorthand (built-in)
  cy.get('thead > tr >')
    .then(($tr) => _.map($tr, 'innerText'))
    .should('deep.eq', headings)

  // ramda is short, but doesn't auto-convert jQuery objects to arrays
  cy.get('thead > tr >')
    .then(($tr) => pluck('innerText', $.makeArray($tr)))
    .should('deep.eq', headings)

  // ramda with pipe is even shorter
  cy.get('thead > tr >')
    .then(pipe($.makeArray, pluck('innerText')))
    .should('deep.eq', headings)

  // none of the above retry because then is not a query command
  // cypress-map's map retries, because it is a query command
  cy.get('thead > tr >').map('innerText').should('deep.eq', headings)
})

it('confirms the sorted age column: cypress-map is necessary for retrying the chain', () => {
  // can you confirm the "Age" column is not sorted initially?
  // Tip: Use cy.table and other queries from cypress-map

  // initially I tried hard and did an .invoke('every', isSorted)... the assertion is built-in to chai
  // check if an array is sorted: use array.every() takes a callback with 3 args, current value, index, the given array
  // for every element we check if it is gte the previous one
  // the initial element has nothing to be compared to, so we return true for it
  // const isSorted = (value, index, array) =>
  //   index === 0 || value >= array[index - 1]
  const ageColumnValues = () => cy.get('table').table(2, 1)

  ageColumnValues()
    // .then((t) => t.map(Number)) // JS array.map version
    // .then((t) => _.map(t, Number)) // lodash version
    // .then(map(Number)) // ramda version
    .map(Number) // shortest, and the only one that retries the chain
    .should('not.be.sorted')

  // click the sort button
  cy.get('#sort-by-date').click()

  // the "Age" column should be sorted in ascending order
  ageColumnValues()
    // .then((t) => t.map(Number)) // JS array.map version (won't work)
    // .then((t) => _.map(t, Number)) // lodash version (won't work)
    // .then(map(Number)) // ramda version (won't work)
    .map(Number) // the only version that works, because it retries!
    .should('be.sorted')
})

it.skip('confirms the sorted age column (Gleb version)', () => {
  // can you confirm the "Age" column is not sorted initially?
  // Tip: Use cy.table and other queries from cypress-map
  const ageColumnValues = () => cy.get('table tbody').table(2, 0, 1)

  ageColumnValues()
    // .invoke('flatMap', Cypress._.identity) // unnecessary flattening, because map(Number) already does it
    .map(Number)
    .tap()
    .should('not.be.sorted')

  // click the sort button
  cy.get('#sort-by-date').click()
  // the "Age" column should be sorted in ascending order
  ageColumnValues()
    // .invoke('flatMap', Cypress._.identity) // unnecessary flattening, because map(Number) already does it
    .map(Number)
    .should('be.ascending')
})

it('confirms the name and dates of the last two sorted rows', () => {
  // sort the table by date
  cy.get('#sort-by-date').click()

  // confirm the last two rows have
  // the following name and dates
  const values = [
    ['Joe', '2001-01-24'],
    ['Anna', '2010-03-26'],
  ]

  cy.get('table').table(0, 3, 2).should('deep.eq', values)

  // what if we don't know the number of rows?
  // Can you rewrite the above code to slice the table correctly?
  cy.get('table')
    .table()
    .invoke('slice', -2) // gets the last two rows
    .mapInvoke('slice', 0, 2) // for each array element, slice the first two columns
    .should('deep.eq', values)
})
