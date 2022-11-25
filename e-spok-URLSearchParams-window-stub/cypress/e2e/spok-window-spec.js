import { resetDatabase } from './utils'

import todos from '../fixtures/example.json'
import spok from 'cy-spok'

describe('Todo API', () => {
  beforeEach(resetDatabase)

  beforeEach(() => {
    // iterate over the list of todos loaded from example.json
    // create a new todo item on the server
    // by making a cy.request to "POST /todos"
    // https://on.cypress.io/request

    todos.forEach((todo) => {
      cy.request('POST', '/todos', todo)
    })

    // confirm the backend has the expected number of todos
    // by requesting it yourself from "GET /todos"
    // The number of todos should equal to the number of todos
    // imported from the example.json file
    cy.request('GET', '/todos').its('body').should('have.length', todos.length)
  })

  it('checks todos', () => {
    // The command cy.visit yields the "window" object of the application
    // if you look at "app.js", the application sets "window.app" object
    // from that object you can get the "todos" property which is Vuex store
    //
    // the number of todos in the store should equal to the number
    // of todos in the example.json file

    // get the list of todos and iterate over each item
    // confirm that every todo object has fields that satisfy
    // following type predicates
    // - id is a string
    // - title is a string
    // - completed is a boolean
    //
    // Tip: you can use "spok" predicates AND Cypress._ predicates
    // and even write your own small functions
    // pretend we do not have the exact list of todos
    // instead we want to check each item in the list
    cy.visit('/')
      .then((window) => {
        const { todos } = window.app.$store.state
        expect(todos).to.have.length(todos.length)
        return todos
      })
      .each((todo) =>
        cy.wrap(todo).should(
          spok({
            id: spok.string,
            title: spok.string,
            completed: spok.boolean,
          }),
        ),
      )
  })
})
