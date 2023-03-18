/// <reference types="cypress" />

import 'cypress-map'
import { pipe, pluck } from 'ramda'
const { _, $ } = Cypress

describe('cypress-map', () => {
  beforeEach(() => cy.visit('cypress/fixtures/prices-list.html'))

  context('map', () => {
    // get the list of prices LI elements from each item extract the inner text
    // and the list of strings should equal ['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20']
    // Tip: you are mapping the list of DOM elements into a list of strings; each item => item.innerText
    it('shows the expected items - cypress-map', () => {
      cy.get('#prices li')
        // .then(($li) => {
        //   console.log($li)
        //   /* jQuery.fin.init ...
        //   {
        //     "0": {},
        //     "length": 1,
        //     "prevObject": {
        //         "0": {
        //             "location": {
        //                 "ancestorOrigins": {
        //                     "0": "http://localhost:50706"
        //                 },
        //                 "href": "http://localhost:50706/cypress/prices-list.html",
        //                 "origin": "http://localhost:50706",
        //                 "protocol": "http:",
        //                 "host": "localhost:50706",
        //                 "hostname": "localhost",
        //                 "port": "50706",
        //                 "pathname": "/cypress/prices-list.html",
        //                 "search": "",
        //                 "hash": ""
        //             },
        //             "referrer": ""
        //         },
        //         "length": 1
        //     },
        //     "selector": "#prices li"
        //   }
        // */
        //   console.log($li[0]) // <li data-price="99">Oranges $0.99</li>
        //   console.log($li[0].innerText) // Oranges $0.99
        //   console.log($li.text()) // Oranges $0.99
        //   console.log($li.map(($li) => $li.innerText)) // ['Oranges $0.99']
        //   console.log(_.map($li, 'innerText')) // ['Oranges $0.99']
        // })
        // similar to _.map, we can just use the cypress-map shorthand
        // see https://github.com/muratkeremozcan/cypress-conduit-tags/blob/main/cypress/e2e/likes.cy.js#L33
        .map('innerText')
        .should('deep.eq', ['Oranges $0.99', 'Mango $1.01', 'Potatoes $0.20'])
    })

    it('shows the expected items - lodash', () => {
      cy.get('#prices li')
        .should('have.length', 3) // must have it with lodash
        .then(($els) => _.map($els, 'innerText')) // because then is not a query command (doesn't retry)
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
        .mapInvoke('getAttribute', 'data-price') // calls 'getAttribute' on every item on the list
        .tap()
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
        .tap()
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

    it('using tap', () => {
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
