// https://cypress.tips/courses/cypress-plugins/lessons/let8fbsnhd
// cypress/e2e/viewports.cy.ts
import 'cypress-each'
import { resolutions, testViewPort } from './utils'

beforeEach(() => {
  // reset the backend data before each test
  cy.request('POST', '/reset', { todos: [] })
})

describe('Viewports', () => {
  it.each(
    resolutions,
    3,
    1,
  )(
    'works in resolution %d x %d',
    // @ts-ignore
    testViewPort,
  )
})
