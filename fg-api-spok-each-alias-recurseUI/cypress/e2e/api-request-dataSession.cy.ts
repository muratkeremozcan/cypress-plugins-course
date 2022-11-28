import 'cypress-aliases/commands'
import 'cypress-data-session'

beforeEach(() => {
  cy.dataSession({
    // name of the session is the alias name
    name: 'todoId',
    setup() {
      // reset the existing todos
      cy.request('POST', '/reset', { todos: [] })
      // create the todo and yield the id
      // that will be the aliased value
      return cy
        .request('POST', '/todos', {
          title: 'test todo',
          completed: false,
        })
        .its('body.id')
        .as('id', { keep: true }) // KEY: keep the value
    },
    validate(todoId: string) {
      // validate the potential id
      // by requesting it from the server
      // and checking the response
      return cy
        .request({
          url: '/todos/' + todoId,
          failOnStatusCode: false,
        })
        .then((res) => {
          if (!res.isOkStatusCode) {
            return false
          }
          return res.body.completed !== true
        })
    },
  })
})
it('created the correct todo', () => {
  cy.request('GET', '/todos/@id')
    .its('body')
    .as('todo')
    .should('deep.eq', {
      title: 'test todo',
      id: 1,
      completed: false,
    })
})

it('completes the created todo', () => {
  cy.request('PATCH', '/todos/@id', { completed: true })

  cy.request('GET', '/todos/@id')
    .its('body')
    .as('todo')
    .should('deep.eq', {
      title: 'test todo',
      id: 1,
      completed: true,
    })
})
