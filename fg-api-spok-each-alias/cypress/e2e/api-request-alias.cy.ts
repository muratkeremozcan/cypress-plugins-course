import 'cypress-aliases/commands/request'

it('makes API requests using the previous value alias', () => {
  cy.request('POST', '/reset', { todos: [] })

  cy.request('POST', '/todos', { title: 'test todo' })
    .its('body.id')
    .as('id')

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

describe('try with before block', () => {
  before(() => {
    cy.request('POST', '/reset', { todos: [] })
    cy.request('POST', '/todos', { title: 'test todo' })
      .its('body.id')
      .as('id')
  })

  it('makes API requests using the previous value alias', () => {
    cy.request('PATCH', '/todos/@id', {
      completed: true,
    })

    cy.request('GET', '/todos/@id')
      .its('body')
      .as('todo')
      .should('deep.eq', {
        title: 'test todo',
        id: 1,
        completed: true,
      })
  })
})
