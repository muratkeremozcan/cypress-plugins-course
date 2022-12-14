import 'cypress-aliases/commands/should'

it('shows the loaded todos', () => {
  // spy on the initial data load
  // Important: to avoid the server sending the 304 (cached)
  // response and no data items, remove the caching
  // header "if-none-match" to force the server
  // to send the real data
  cy.intercept('GET', '/todos', (req) => {
    delete req.headers['if-none-match']
  }).as('load')
  // visit the home page
  // https://on.cypress.io/visit
  cy.visit('/')

  // wait for the "load" network call
  // grab its response body's length
  // and then confirm the page shows the same number
  // of items "li.todo"
  // https://on.cypress.io/wait
  // https://on.cypress.io/its
  // https://on.cypress.io/then
  // cy.wait('@load')
  //   .its('response.body').as('todos')
  // .then((todos) => {
  //   cy.get('li.todo').should('have.length', todos.length)
  // })
  // use cypress-alias instead
  cy.wait('@load')
    .its('response.body.length')
    .as('todos-length')
  cy.get('li.todo').should('have.length', '@todos-length')
})
