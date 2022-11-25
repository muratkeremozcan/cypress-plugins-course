const api = Cypress.env('api')
expect(api, 'api url').to.be.a('string')

it('resets todos by spying on the GET /todos', () => {
  cy.intercept('GET', '/todos', req => {
    // remove the caching request header
    // forcing the browser to send the actual data
    // and not simply respond with "304 Not Modified"
    delete req.headers['if-none-match']
  }).as('todos')
  cy.visit('/')
  cy.wait('@todos')
    .its('response.body', {timeout: 0})
    // If the response.body is not empty
    // reset the backend data by making
    // a POST api + '/reset' call
    // using the cy.request command
    // and passing the { todos: [] } object as an argument
    // https://on.cypress.io
    // Do you have to do anything else to clear
    // the application's UI after resetting the data?
    .if('not.empty')
    .request('POST', api + '/reset', {todos: []})
    .reload()
    .else()
    .log('nothing to clear')

  // you could just avoid conditional logic entirely, and reset all the time
  // cy.request('POST', api + '/reset', {
  //   todos: [],
  // })
  // cy.visit('/')
  // cy.get('.new-todo').type('Write more tests{enter}')
  // cy.get('li.todo').should('have.length', 1)

  cy.clearSurvey()
  cy.get('.new-todo').type('Write more tests{enter}')
  cy.get('li.todo').should('have.length', 1)
})
