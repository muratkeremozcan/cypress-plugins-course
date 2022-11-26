import 'cypress-plugin-api'

it('deletes all items one by one', () => {
  // fetch all todo items using "GET /todos" API call
  // get the body of the response, and it should
  // be an array of objects. Go through each object
  // and make a "DELETE /todos/:id" request
  cy.api('/todos')
    .its('body')
    .then(console.table)
    .each(({ id }) => {
      cy.api('DELETE', `/todos/${id}`)
    })
  // confirm there are no todo items
  // by fetching them all again, the response
  // should be an empty list
  cy.api('/todos').its('body').should('deep.equal', [])
})
