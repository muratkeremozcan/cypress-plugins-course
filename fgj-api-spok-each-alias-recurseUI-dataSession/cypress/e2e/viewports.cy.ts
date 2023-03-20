import 'cypress-each'
import { resolutionsJson } from './resolutions.json'
/*
// you can do an 2 dimensional array
const resolutions = [
  [1280, 1024],
  [700, 500],
  [300, 500],
]

// you can do an object 
// where each key is going to be the test title
const resolutionsObj = {
  desktop: [1280, 1024],
  mobile: [800, 600],
  tablet: [1024, 768],
}

// v1
it.each(resolutions)(
  'works in resolution %d x %d', 
  (w, h) => {..})

// v2
it.each(resolutions)(
  ([w, h]) => `works in resolution ${w} x ${h}`,
  (w, h) => {..})

// v3
it.each(resolutionsObj)(
  (w, h) => {..})

*/

beforeEach(() => {
  // reset the backend data before each test
  cy.request('POST', '/reset', { todos: [] })
})

const resolutions = [
  [1280, 1024],
  [700, 500],
  [300, 500],
]
// we can use  a test object of data instead of an array.
// Then each key is going to be the test title.
const resolutionsObj = {
  desktop: [1280, 1024],
  mobile: [800, 600],
  tablet: [1024, 768],
}

describe('Viewports', () => {
  // version 1
  it.each(resolutions)(
    'Version 1: works in resolution %d x %d',
    // @ts-ignore
    (w: number, h: number) => {
      cy.viewport(w, h)
      cy.visit('/')
      cy.get('.new-todo')
        .type('one{enter}')
        .type('two{enter}')
        .type('three{enter}')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('.todo-count', '3')
      cy.contains('li.todo', 'two').find('.toggle').click()
      cy.contains('li.todo', 'two').should(
        'have.class',
        'completed',
      )
      cy.contains('.todo-count', '2')
      cy.intercept('DELETE', '/todos/*').as('delete')
      cy.contains('button', 'Clear completed').click()
      cy.get('li.todo').should('have.length', 2)
      cy.wait('@delete')
        .its('response.statusCode')
        .should('equal', 200)
      cy.request('GET', '/todos')
        .its('body')
        .should('have.length', 2)
    },
  )

  // version 2
  it.each(resolutions)(
    ([w, h]) =>
      `Version 2: works in resolution ${w} x ${h}`,
    // @ts-ignore
    (w: number, h: number) => {
      cy.viewport(w, h)
      cy.visit('/')
      cy.get('.new-todo')
        .type('one{enter}')
        .type('two{enter}')
        .type('three{enter}')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('.todo-count', '3')
      cy.contains('li.todo', 'two').find('.toggle').click()
      cy.contains('li.todo', 'two').should(
        'have.class',
        'completed',
      )
      cy.contains('.todo-count', '2')
      cy.intercept('DELETE', '/todos/*').as('delete')
      cy.contains('button', 'Clear completed').click()
      cy.get('li.todo').should('have.length', 2)
      cy.wait('@delete')
        .its('response.statusCode')
        .should('equal', 200)
      cy.request('GET', '/todos')
        .its('body')
        .should('have.length', 2)
    },
  )

  // version 3
  // with this version test name is the key
  it.each(resolutionsObj)(
    // @ts-ignore
    (w: number, h: number) => {
      cy.viewport(w, h)
      cy.visit('/')
      cy.get('.new-todo')
        .type('one{enter}')
        .type('two{enter}')
        .type('three{enter}')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('.todo-count', '3')
      cy.contains('li.todo', 'two').find('.toggle').click()
      cy.contains('li.todo', 'two').should(
        'have.class',
        'completed',
      )
      cy.contains('.todo-count', '2')
      cy.intercept('DELETE', '/todos/*').as('delete')
      cy.contains('button', 'Clear completed').click()
      cy.get('li.todo').should('have.length', 2)
      cy.wait('@delete')
        .its('response.statusCode')
        .should('equal', 200)
      cy.request('GET', '/todos')
        .its('body')
        .should('have.length', 2)
    },
  )

  // version 4: the config can be in a json file
  it.each(resolutions)(
    'Version 4, Config from Json: works in resolution %d x %d',
    // @ts-ignore
    (w: number, h: number) => {
      cy.viewport(w, h)
      cy.visit('/')
      cy.get('.new-todo')
        .type('one{enter}')
        .type('two{enter}')
        .type('three{enter}')
      cy.get('li.todo').should('have.length', 3)
      cy.contains('.todo-count', '3')
      cy.contains('li.todo', 'two').find('.toggle').click()
      cy.contains('li.todo', 'two').should(
        'have.class',
        'completed',
      )
      cy.contains('.todo-count', '2')
      cy.intercept('DELETE', '/todos/*').as('delete')
      cy.contains('button', 'Clear completed').click()
      cy.get('li.todo').should('have.length', 2)
      cy.wait('@delete')
        .its('response.statusCode')
        .should('equal', 200)
      cy.request('GET', '/todos')
        .its('body')
        .should('have.length', 2)
    },
  )

  // it('works in resolution 1280 x 1024', () => {
  //   cy.viewport(1280, 1024)
  //   cy.visit('/')
  //   cy.get('.new-todo')
  //     .type('one{enter}')
  //     .type('two{enter}')
  //     .type('three{enter}')
  //   cy.get('li.todo').should('have.length', 3)
  //   cy.contains('.todo-count', '3')
  //   cy.contains('li.todo', 'two').find('.toggle').click()
  //   cy.contains('li.todo', 'two').should('have.class', 'completed')
  //   cy.contains('.todo-count', '2')
  //   cy.intercept('DELETE', '/todos/*').as('delete')
  //   cy.contains('button', 'Clear completed').click()
  //   cy.get('li.todo').should('have.length', 2)
  //   cy.wait('@delete').its('response.statusCode').should('equal', 200)
  //   cy.request('GET', '/todos').its('body').should('have.length', 2)
  // })

  // it('works in resolution 700 x 500', () => {
  //   cy.viewport(700, 500)
  //   cy.visit('/')
  //   cy.get('.new-todo')
  //     .type('one{enter}')
  //     .type('two{enter}')
  //     .type('three{enter}')
  //   cy.get('li.todo').should('have.length', 3)
  //   cy.contains('.todo-count', '3')
  //   cy.contains('li.todo', 'two').find('.toggle').click()
  //   cy.contains('li.todo', 'two').should('have.class', 'completed')
  //   cy.contains('.todo-count', '2')
  //   cy.intercept('DELETE', '/todos/*').as('delete')
  //   cy.contains('button', 'Clear completed').click()
  //   cy.get('li.todo').should('have.length', 2)
  //   cy.wait('@delete').its('response.statusCode').should('equal', 200)
  //   cy.request('GET', '/todos').its('body').should('have.length', 2)
  // })

  // it('works in resolution 300 x 500', () => {
  //   cy.viewport(300, 500)
  //   cy.visit('/')
  //   cy.get('.new-todo')
  //     .type('one{enter}')
  //     .type('two{enter}')
  //     .type('three{enter}')
  //   cy.get('li.todo').should('have.length', 3)
  //   cy.contains('.todo-count', '3')
  //   cy.contains('li.todo', 'two').find('.toggle').click()
  //   cy.contains('li.todo', 'two').should('have.class', 'completed')
  //   cy.contains('.todo-count', '2')
  //   cy.intercept('DELETE', '/todos/*').as('delete')
  //   cy.contains('button', 'Clear completed').click()
  //   cy.get('li.todo').should('have.length', 2)
  //   cy.wait('@delete').its('response.statusCode').should('equal', 200)
  //   cy.request('GET', '/todos').its('body').should('have.length', 2)
  // })
})
