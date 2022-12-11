/// <reference types="cypress" />

import 'cypress-map'
import { pipe, pluck } from 'ramda'
const { $ } = Cypress

describe('cypress-map', () => {
  beforeEach(() => cy.visit('cypress/prices-list.html'))

  context('retry chain perks with cy12', () => {
    it('has the last item', () => {
      // confirm the last item in the list has HTML
      // attribute "data-price=20"
      cy.get('#prices li').last().should('have.attr', 'data-price', '20')
    })
    // before cy 12 you would have to ensure everything has loaded
    it('has the last item: bonus 1', () => {
      // confirm the last item in the list has HTML
      // attribute "data-price=20"
      cy.get('#prices li') // query
        .should('have.length', 3) // assertion
        .last() // query
        .should('have.attr', 'data-price', '20') // assertion
    })
    // you could also do it with jquery, because you had to have 1 command
    it('has the last item: bonus 2', () => {
      // confirm the last item in the list has HTML
      // attribute "data-price=20"
      cy.get('#prices li:last') // query
        .should('have.attr', 'data-price', '20') // assertion
    })
  })

  context('map', () => {
    // get the list of prices LI elements from each item extract the inner text
    // and the list of strings should equal ['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20']
    // Tip: you are mapping the list of DOM elements into a list of strings; each item => item.innerText
    it('shows the expected items - cypress-map', () => {
      cy.get('#prices li')
        .map('innerText')
        .should('deep.eq', ['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20'])
    })

    const pipedInnerText = pipe($.makeArray, pluck('innerText'))

    it('shows the expected items - ramda', () => {
      cy.get('#prices li')
        .should('have.length', 3) // must have it with ramda
        .then(pipedInnerText) // because then is not a query command (doesn't retry)
        .should('deep.eq', ['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20'])
    })

    // get the last 2 items in the list
    // Tip: cy.invoke command is a query command (it retries)
    it('confirms the text in the last two items - cypress-map', () => {
      cy.get('#prices li')
        .map('innerText')
        .invoke('slice', -2)
        .should('deep.eq', ['Mango $1.01', 'Potatoes $0.20'])
    })

    it('confirms the text in the last two items - ramda', () => {
      cy.get('#prices li')
        .should('have.length', 3) // must have it with ramda
        .then(pipedInnerText) // because then doesn't retry
        .invoke('slice', -2)
        .should('deep.eq', ['Mango $1.01', 'Potatoes $0.20'])
    })
  })

  context('mapInvoke, reduce', () => {
    it('confirms the data-price attribute in all items', () => {
      // get the list of prices LI elements
      // from each DOM element get the attribute "data-price"
      // convert each string into a number
      // the confirm the list is equal to [99, 101, 20]
      cy.get('#prices li')
        .should('have.length', 3)
        .mapInvoke('getAttribute', 'data-price')
        .should('deep.eq', ['99', '101', '20'])
        .map(Number)
        .should('deep.eq', [99, 101, 20])
    })

    const sum = (a, b) => a + b
    it('confirms the sum of data-price attributes', () => {
      // get the list of prices LI elements
      // from each DOM element get the attribute "data-price"
      // convert each string into a number
      // sum them all and confirm the total is 220
      cy.get('#prices li')
        .should('have.length', 3)
        .mapInvoke('getAttribute', 'data-price')
        .map(Number)
        .reduce(sum)
        .should('equal', 220)
    })

    it('adds all prices together', () => {
      cy.contains('#total', '$')
        .should('have.attr', 'data-total')
        .then(Number)
        .should('be.within', 1, 1000)
        .then((total) => {
          cy.get('#prices li')
            // .should('have.length', 3) // not needed with cy 12
            .mapInvoke('getAttribute', 'data-price')
            .map(Number)
            .reduce(sum)
            .should('equal', total)
        })
    })

    it.only('using tap', () => {
      cy.get('#total')
        .should('have.attr', 'data-total')
        .then(Number)
        .should('be.within', 1, 1000)
        .then((total) => {
          cy.get('#prices li')
            .should('have.length', 3) // not needed with cy 12
            .mapInvoke('getAttribute', 'data-price')
            // .tap((i) => {
            //   // use tap instead of then for retry chain perks
            //   console.log('tapped: ', i)
            // })
            .map(Number)

            .reduce(sum)
            .tap() // you can also use this without console ninja
            // .tap(console.log) // same
            .should('equal', total)
        })
    })
  })
})
