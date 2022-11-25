import spok from 'cy-spok'
import { removeTodo } from '../../src/store/reducers/todosSlice'

const winStore = () => cy.window().its('store')
const getState = () => winStore().invoke('getState')
const resetStore = () =>
  getState()
    .its('todos.data')
    .each((todo: any) => {
      cy.window().its('store').invoke('dispatch', removeTodo(todo.id))
    })

beforeEach(() => {
  cy.visit('/')
  resetStore()
})

it('adds todos', () => {
  cy.get('input[placeholder="Add new todo here"]')
    .type('Learn Cypress{enter}')
    .type('Learn JavaScript{enter}')
  cy.get('[data-cy=todo]').should('have.length', 2)
  cy.contains('[data-cy="pending-count"]', '2')
  cy.contains('[data-cy=todo]', 'Learn JavaScript').find('[alt=remove]').click()
  cy.contains('[data-cy=todo]', 'Learn Cypress').should('be.visible')
  cy.contains('[data-cy="pending-count"]', '1')
  cy.get('[data-cy=todo]').should('have.length', 1)
})

it('adds todos, check store', () => {
  // we assume the application sets "window.store"
  // if running inside the Cypress test
  cy.log('**check the Redux state**')
  // get the state of the Redux store
  // https://on.cypress.io/window
  // https://on.cypress.io/its
  // https://on.cypress.io/invoke
  // and confirm the data inside the Redux store
  // using cy-spok plugin

  // add a few todos using the application UI
  cy.get('input[placeholder="Add new todo here"]')
    .type('Learn Cypress{enter}')
    .type('Learn JavaScript{enter}')

  getState()
    // .then((data) => {
    //   console.log(JSON.stringify(data))
    // })
    .should(
      spok({
        todos: {
          data: [
            {
              $topic: 'The second todo',
              text: 'Learn JavaScript',
              id: spok.number,
            },
            {
              $topic: 'The first todo',
              text: 'Learn Cypress',
              id: spok.number,
            },
          ],
        },
      }),
    )
    // grab the ID of the first todo item
    // grab the Redux store again and dispatch the remove todos action
    .its('todos.data.0.id')
    .then((id) => winStore().invoke('dispatch', removeTodo(id)))

  // once we remove the first todo, the UI should update
  // confirm the UI changes and the single todo remains
  cy.contains('[data-cy="pending-count"]', '1')
  cy.contains('[data-cy=todo]', 'Learn Cypress')

  getState().should(
    spok({
      todos: {
        data: [
          {
            $topic: 'The first todo',
            text: 'Learn Cypress',
            id: spok.number,
          },
        ],
      },
    }),
  )
})
