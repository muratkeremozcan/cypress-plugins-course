import '../support/data-session-utils'

it('has creates a todo item', () => {
  // cy.dataSession({
  //   name: 'my todo X',
  //   setup() {
  //     cy.request('POST', '/reset', { todos: [] })
  //     cy.request('POST', '/todos', {
  //       title: 'my todo X',
  //     }).its('body.id')
  //   },
  //   validate(id) {
  //     return cy
  //       .request({
  //         url: '/todos/' + id,
  //         failOnStatusCode: false,
  //       })
  //       .its('isOkStatusCode')
  //   },
  //   showValue: true,
  //   shareAcrossSpecs: true,
  // })
  cy.visit('/')
  cy.contains('li.todo', 'my todo X')
})

// If you want to access the created cached Todo item's id,
// simply use the alias created by the data session; it is its name.
it('has creates a todo item', function () {
  expect(this['my todo X']).to.be.a('number')
  cy.visit('/')
  cy.contains('li.todo', 'my todo X')
})
