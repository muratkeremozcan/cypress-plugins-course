import 'cypress-data-session'
import 'cypress-aliases'

it('caches a Todo title', () => {
  // create a new Todo item with the title
  // "random " + some random number
  // store the random title in the data session
  // and either use an alias or yield the title
  // to the next block of commands

  cy.dataSession({
    name: 'title',
    setup() {
      const title = 'random ' + Cypress._.random(1e6)
      cy.request('POST', '/todos', { title }).its(
        'body.title',
      )
    },
    showValue: true,
  })

  // visit the site
  // and confirm the random title is displayed
  cy.visit('/')
  cy.contains('li.todo', '@title')
})

it('caches the Todo item ID', () => {
  // create a new Todo item with the title
  // "title " + some random number
  // store the Todo ID in the data session
  cy.dataSession({
    name: 'todoId',
    setup() {
      const title = 'title ' + Cypress._.random(1e6)
      cy.request('POST', '/todos', { title }).its('body.id')
    },
    showValue: true,
  })

  // find the title of the Todo item by its id
  cy.request('GET', '/todos/' + '@todoId')
    .its('body.title')
    .as('title')

  // visit the site
  // and confirm that title is displayed
  cy.visit('/')
  cy.contains('li.todo', '@title')
})

it('caches the title and the id', () => {
  // create a new Todo item with the title
  // "todo " + some random number
  // store { title, id } object in the data session
  // under the alias "todo"
  // explicitly pick only the "id" and the "title" properties
  cy.dataSession({
    name: 'todo',
    setup() {
      const title = 'title ' + Cypress._.random(1e6)
      cy.request('POST', '/todos', { title })
        .its('body')
        .then((body) => ({
          id: body.id,
          title: body.title,
        }))
    },
    showValue: true,
  })

  // use the "cy.get('@todo').then((todo) => { ... })"
  // to access the aliased object
  // Tip: in TypeScript you might need to give cy.get a type parameter
  type Todo = {
    title: string
    id: string
  }
  cy.get<Todo>('@todo').then((todo) => {
    // update the Todo item to set the "completed: true"
    // by making an API call
    cy.request('PATCH', `/todos/${todo.id}`, {
      completed: true,
    })

    // visit the site
    cy.visit('/')
    // and confirm that title is displayed and the element
    // has class "completed"
    cy.contains('li.todo', todo.title).should(
      'have.class',
      'completed',
    )
  })
})
