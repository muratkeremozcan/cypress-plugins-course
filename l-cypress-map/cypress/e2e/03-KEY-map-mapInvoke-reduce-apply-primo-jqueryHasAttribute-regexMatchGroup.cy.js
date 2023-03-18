/// <reference types="cypress" />

import 'cypress-map'
const { _, $ } = Cypress

beforeEach(() => cy.visit('cypress/fixtures/prices-list.html'))

it('counts the number of elements with data-selected attribute', () => {
  // get the price LI elements
  // ask each element if it has attribute "data-selected"
  // convert the "true/false" into 1/0 numbers
  // and then count all "1"s by using reduce
  // and the total sum should be 2
  // https://on.cypress.io/get
  // mapInvoke, map, reduce
  cy.get('#prices li')
    .mapInvoke('hasAttribute', 'data-selected')
    .map(Number)
    .reduce(Cypress._.add, 0)
    .should('equal', 2)

  // same thing
  cy.get('#prices li[data-selected]').should('have.length', 2)
})

it('extracts dollars and cents from each list item', () => {
  cy.visit('cypress/fixtures/prices-list.html')
  // get the price LIST elements
  // from each element find the "$x.yy" price strings
  // and extract just the dollars and cents
  // convert the strings to numbers
  // and they should be 0.99, 1.01, and 0.2
  cy.get('#prices li')
    .map('innerText')
    .mapInvoke('split', '$')
    .map((item) => item[1])
    .map(Number)
    .should('deep.equal', [0.99, 1.01, 0.2])

  // Gleb's version
  cy.get('#prices li')
    .map('innerText')
    .mapInvoke('match', /\$(?<price>\d+\.\d{2})/) // breakdown of "$x.yy" into variables under named group price
    .map('groups')
    .map('price')
    .map(Number)
    .print()
    .print('can use notation %o')
    .print('print properties {0.length}')
    .print('second number {0.1}')
    .should('deep.equal', [0.99, 1.01, 0.2])
})

it('finds the element with min price and confirms its attribute', () => {
  // get the price LI elements
  // and find the element with the smallest "data-price" attribute
  // if converted into a number
  // Hint: if you reduce a list of items into a single value
  // you probably need to use ... cy.reduce
  // and confirm the found element has the attribute "data-price=20"
  cy.get('#prices li')
    .mapInvoke('getAttribute', 'data-price') // calls 'getAttribute' on every item on the list
    .map(Number)
    .apply((arr) => arr.sort((a, b) => a - b))
    .primo()
    .should('eq', 20)

  // Gleb's version
  // if no initial value for reduce, the array element at index 0 is used as the initial value
  // and the iteration starts from the next element (index 1 instead of index 0).
  cy.get('#prices li')
    .reduce((minEl, el) => {
      const minPrice = Number(minEl.getAttribute('data-price')) //?
      const elPrice = Number(el.getAttribute('data-price')) //?
      return minPrice < elPrice ? minEl : el
    })
    .should('have.attr', 'data-price', '20')
})

it('has one of the fruit names', () => {
  // the list of allowed fruits and vegetables
  const names = ['Oranges', 'Potatoes', 'Mango']
  // get all three LI elements with attribute "data-price"
  // and check if the item text is one of the allowed names above
  //
  // Warning: the text of each item includes more than the name!
  // Question: can you use cy.each?
  //
  // tip: map the list of items to the inner text
  //
  // now that we have all items' strings
  // we can confirm that every item includes some name
  // from the list above
  // tip: inside should(callback) function you can use
  // any "expect" assertion, but make sure the error message
  // is helpful to debug the test if it fails
  // write a regex to get the string until the first empty space 'Oranges $0.99'

  cy.get('#prices li[data-price]')
    .map('innerText')
    .should('have.length', 3)
    .mapInvoke('match', /^(?<fruitName>\S+)/)
    .map('groups')
    .map('fruitName')
    .each((fruitName) => expect(fruitName).to.be.oneOf(names))

  // Gleb's version
  cy.get('li[data-price]')
    .map('innerText')
    .should('have.length', 3)
    .each((fruitName, k) => {
      const includesName = names.some((name) => fruitName.includes(name))
      expect(includesName, `item ${k + 1} ${fruitName}"`).to.be.true
    })
  // or this
  // .and((strings) => {
  //   strings.forEach((itemText, k) => {
  //     const includesName = names.some((name) => itemText.includes(name))
  //     expect(includesName, `item ${k + 1} "${itemText}"`).to.be.true
  //   })
  // })
})
