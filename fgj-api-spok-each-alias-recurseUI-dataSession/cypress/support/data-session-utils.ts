import './commands'
import 'cypress-data-session'

beforeEach(() => {
  cy.dataSession({
    name: 'my todo X',
    setup() {
      cy.request('POST', '/reset', { todos: [] })
      cy.request('POST', '/todos', {
        title: 'my todo X',
      }).its('body.id')
    },
    validate(id) {
      return cy
        .request({
          url: '/todos/' + id,
          failOnStatusCode: false,
        })
        .its('isOkStatusCode')
    },
    showValue: true,
    shareAcrossSpecs: true,
  })
})

// run after all specs are done
// after(() => cy.request('POST', '/reset', { todos: [] }))

// you can alternatively use it as a utils file
/*

export function prepareMyTodo() {
  cy.dataSession({
    name: 'my todo X',
    setup() {
      cy.request('POST', '/reset', { todos: [] })
      cy.request('POST', '/todos', {
        title: 'my todo X',
      }).its('body.id')
    },
    validate(id) {
      return cy
        .request({
          url: '/todos/' + id,
          failOnStatusCode: false,
        })
        .its('isOkStatusCode')
    },
    showValue: true,
    shareAcrossSpecs: true,
  })
}


// at the spec file
import { prepareMyTodo } from '../support/utils'

beforeEach(prepareMyTodo)

it('has creates a todo item', function () {
  cy.visit('/')
  cy.contains('li.todo', 'my todo X')
})


*/
