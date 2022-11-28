import { recurse } from 'cypress-recurse'
// @ts-expect-error no types yet
import { map, tap, really } from 'cypress-should-really'
import * as R from 'ramda'
const { $ } = Cypress
// @ts-ignore
import chaiSorted from 'chai-sorted'
chai.use(chaiSorted)

const todos = [
  {
    id: '1',
    title: 'ball',
  },
  {
    id: '2',
    title: 'apple',
  },
]

function getTexts($el: JQuery) {
  return Cypress._.map($el, 'innerText')
}

it('items are sorted after the network call', () => {
  // reset the backend data by making an API call
  // https://on.cypress.io/request
  cy.request('POST', '/reset', { todos })
  // visit the application
  // https://on.cypress.io/visit
  cy.visit('/')
  // confirm the application shows the loaded todo items
  cy.get('li.todo').should('have.length', todos.length)
  // spy on the "POST /reset" network call the application makes
  cy.intercept('POST', '/reset').as('reset')
  // sort the items slowly
  cy.get('[data-cy=sort-slowly]').click()
  // wait for the network call - this means the page
  // has been updated
  cy.wait('@reset')
  // extract the text from each todo label
  // and confirm the labels are sorted alphabetically
  // Hint: use the utility "getTexts" function
  // before "deep.equal" assertion
  cy.get('li.todo label')
    .then(getTexts)
    .should('deep.equal', ['apple', 'ball'])
  // confirm the server has the sorted data
  // by requesting it ourselves
  // and confirming the returned items are the same
  // as the original "todos" list but in the reverse order
  cy.request('/todos')
    .its('body')
    .should('deep.equal', [todos[1], todos[0]])
  // reload the page and confirm the todo labels are still sorted
  // https://on.cypress.io/reload
  cy.reload()
  cy.get('li.todo label')
    .then(getTexts)
    .should('deep.equal', ['apple', 'ball'])
})

it('sorts the items, using cypress-recurse with UI', () => {
  cy.request('POST', '/reset', { todos })
  cy.visit('/')
  // confirm the application shows the loaded todo items
  cy.get('li.todo').should('have.length', todos.length)

  // sort the items slowly
  cy.get('[data-cy=sort-slowly]').click()
  // extract the text from each todo label
  // and confirm the labels are sorted alphabetically
  // Hint: use the utility "getTexts" function
  // before "deep.equal" assertion

  recurse(
    // the commands function
    () => cy.get('li.todo label').then(getTexts),
    // predicate
    (list) => expect(list).to.deep.equal(['apple', 'ball']),
    // options
    {
      log: 'Sorted!',
      timeout: 10_000,
      delay: 500,
    },
  )
})

it('sorts items, using cypress-recurse with API', () => {
  // reset the backend data by making an API call
  // https://on.cypress.io/request
  cy.request('POST', '/reset', { todos })
  // visit the application
  // https://on.cypress.io/visit
  cy.visit('/')
  // confirm the application shows the loaded todo items
  cy.get('li.todo').should('have.length', todos.length)

  cy.get('[data-cy=sort-slowly]').click()
  // make the call to the /todos endpoint
  // and check if the returned items are sorted alphabetically using the recurse helper.
  // Sleep for 500ms between the attempts, and use 10 seconds time limit

  recurse(
    () => cy.request('/todos').its('body'),
    (list) =>
      expect(list).to.deep.equal([todos[1], todos[0]]),
    {
      log: 'Sorted!',
      timeout: 10_000,
      delay: 500,
    },
  )

  // once the API returns the sorted todo items,
  // confirm the list of todos shown on the page matches the same order
  cy.get('li.todo label')
    .then(getTexts)
    .should('deep.equal', ['apple', 'ball'])
})

type Todo = {
  id: string
  title: string
}

describe('classic vs ramda vs should-really', () => {
  beforeEach(() => {
    // reset the backend data by making an API call
    // https://on.cypress.io/request
    cy.request('POST', '/reset', { todos })
    // visit the application
    // https://on.cypress.io/visit
    cy.visit('/')
    // confirm the application shows the loaded todo items
    cy.get('li.todo').should('have.length', todos.length)
    cy.get('[data-cy="sort-slowly"]').click()
  })

  // write a single cy.get + .should($li) command plus assertion callback function to verify the Todo titles are sorted
  // look at the data transformation inside the single should(callback) you have written.
  // Replace the individual steps with helpers from the cypress-should-really collection.
  it('should check item sort the classic way', () => {
    cy.get('li.todo label').should(($li) => {
      const titles = getTexts($li)
      expect(titles, 'titles').to.deep.equal([
        'apple',
        'ball',
      ])
    })
  })

  it('sorts items, using ramda', () => {
    const fn = R.pipe(
      $.makeArray as any, // Element[]
      R.pluck('innerText'), // string[]
      // R.tap(console.log),
    )

    cy.get('li.todo label').should(($li) => {
      expect(fn($li)).to.deep.equal(['apple', 'ball'])
    })
  })

  // Piping the data through a series of functions to be fed to the assertion expect(...).to Chai chainer is so common,
  // that cypress-should-really has a ... helper for this.
  // If you want to transform the data and run it through a Chai assertion use really function.
  // It construct a should(callback) for you:

  it('sorts items, using cypress-should-really', () => {
    cy.get('li.todo label').should(
      really(
        map('innerText'),
        // tap(console.log),
        'deep.equal',
        ['apple', 'ball'],
      ),
    )
  })

  //www.chaijs.com/plugins/chai-sorted/
  https: it('sorts items, using cypress-should-really and chai-sorted', () => {
    cy.get('li.todo label').should(
      really(map('innerText'), 'be.ascending'),
    )
  })
})
