import { todos } from '../fixtures/three.json'
import * as R from 'ramda'
import {
  really,
  map,
  tap,
  its,
  pipe,
  // @ts-expect-error no types yet
} from 'cypress-should-really'
const { $ } = Cypress

type Todo = {
  id: string
  title: string
  completed?: boolean
}

it('has the checked', () => {
  cy.intercept('/todos', todos)
  cy.visit('/')

  // from the list of "todos" objects
  // get the list of completed boolean values
  // as an array called "completed"
  // that should be [true, false, false]
  // Tip: there are several ways you can do it
  const completed = todos.map((todo) =>
    Boolean(todo.completed),
  )
  const completed2 = Cypress._.map(todos, (todo) =>
    Boolean(todo.completed),
  )
  const completedR = R.map((todo: Todo) =>
    Boolean(todo.completed),
  )
  const completedR2 = R.pipe(
    R.pluck('completed'),
    R.map(Boolean),
  )
  const completedSR = pipe(map('completed'), map(Boolean))

  expect(completed2).to.deep.eq(completed)
  expect(completedR(todos)).to.deep.eq(completed)
  // @ts-ignore
  expect(completedR2(todos)).to.deep.eq(completed)
  expect(completedSR(todos)).to.deep.eq(completed)

  expect(completed, 'completed list').to.deep.equal([
    true,
    false,
    false,
  ])
  expect(completedR(todos)).to.deep.equal([
    true,
    false,
    false,
  ])
})

// confirm the item checkboxes has the checked state
// matching the "completed" array

// grab the remaining count, convert the text to a number
// and then confirm it is equal to number 2
describe('classic vs ramda, vs should-really', () => {
  before(() => {
    cy.intercept('/todos', todos)
    cy.visit('/')
  })

  function getStatus($el: JQuery) {
    return Cypress._.map($el, 'checked')
  }
  // const completedJson = todos.map((todo) =>
  //   Boolean(todo.completed),
  // )
  // const completedJson = R.pipe(
  //   R.pluck('completed'),
  //   R.map(Boolean),
  // )(todos)
  const completedJson = pipe(
    map('completed'),
    map(Boolean),
  )(todos)

  it('should check the completed items, the classic way', () => {
    cy.get('li.todo input[type="checkbox"]').should(
      ($checkboxes) => {
        const completedUI = getStatus($checkboxes)
        expect(completedUI).to.deep.equal(completedJson)
      },
    )

    cy.get('[data-cy=remaining-count]').should(($count) => {
      expect(Number($count[0].innerText)).to.eq(2)
    })
  })

  it('should check the completed items, using ramda', () => {
    const fn = R.pipe(
      $.makeArray as any, // Element[]
      getStatus,
    )
    cy.get('li.todo input[type="checkbox"]').should(
      ($checkboxes) => {
        expect(fn($checkboxes)).to.deep.equal(completedJson)
      },
    )

    const fn2 = R.pipe(
      $.makeArray as any, // Element[]
      R.pluck('innerText') as any, // string[]
      R.head, // string
      Number, // number
    )

    cy.get('[data-cy=remaining-count]').should(($count) => {
      expect(fn2($count)).to.eq(2)
    })
  })

  it('should check the completed items, using should-really', () => {
    cy.get('li.todo input[type="checkbox"]').should(
      really(map('checked'), 'deep.eq', completedJson),
    )

    cy.get('[data-cy=remaining-count]').should(
      really(its('0.innerText'), Number, 'equal', 2),
    )
  })
})
