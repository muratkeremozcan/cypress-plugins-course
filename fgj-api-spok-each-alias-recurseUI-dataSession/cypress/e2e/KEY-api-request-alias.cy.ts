import 'cypress-aliases'

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

describe('try with beforeEach', () => {
  beforeEach(() => {
    cy.request('POST', '/reset', { todos: [] })
    cy.request('POST', '/todos', {
      title: 'test todo',
      completed: false,
    })
      .its('body.id')
      .as('id')
  })

  it('created the correct todo', () => {
    // request the Todo item
    // confirm the response body includes the correct title
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
    // update the created todo item, set the "completed: true"
    // using the "PATCH /todos/:id" request
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
})

// We want to create the Todo item once and then keep the aliased value.
// Cypress automatically resets the aliased values,
// but cypress-aliases implements cy.as(aliasName, { keep: true })
// to automatically restore that alias before each test.
describe('try with before + keep value', () => {
  before(() => {
    cy.request('POST', '/reset', { todos: [] })
    cy.request('POST', '/todos', {
      title: 'test todo',
      completed: false,
    })
      .its('body.id')
      .as('id', { keep: true }) // KEY: keep the value
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
})

describe('try with traditional variable assignment', () => {
  let id: string
  before(() => {
    cy.request('POST', '/reset', { todos: [] })
    cy.request('POST', '/todos', {
      title: 'test todo',
      completed: false,
    })
      .its('body.id')
      .then((bodyId) => {
        id = bodyId
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
    cy.request('PATCH', `/todos/${id}`, { completed: true })

    cy.request('GET', `/todos/${id}`)
      .its('body')
      .as('todo')
      .should('deep.eq', {
        title: 'test todo',
        id: 1,
        completed: true,
      })
  })
})
