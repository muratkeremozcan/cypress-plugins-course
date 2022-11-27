import 'cypress-aliases/commands/request'

it('makes API requests using the previous value alias', () => {
  // reset all current todo items
  // by requesting "POST /reset" with the { todos: [] } object
  // https://on.cypres.io/request
  cy.request('POST', '/reset', { todos: [] })

  // add a new todo item by making "POST /todos"
  // with the title "test todo"
  // request the Todo item
  // confirm the response body includes the correct title
  cy.request('POST', '/todos', { title: 'test todo' })
    .its('body.id')
    .as('id')

  // update the created todo item, set the "completed: true"
  // using the "PATCH /todos/:id" request
  cy.request('PATCH', '/todos/@id', { completed: true })

  cy.request('GET', '/todos/@id')
    .its('body')
    .should('deep.eq', {
      title: 'test todo',
      id: 1,
      completed: true,
    })
})
