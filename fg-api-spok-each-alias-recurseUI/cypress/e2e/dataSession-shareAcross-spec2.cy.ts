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
