import 'cypress-aliases/commands/contains'

it('shows the number of todos', () => {
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

  cy.wait('@load')
    .its('response.body.length')
    .as('todos-length')
  cy.contains('.footer', '@todos-length items left')
})
