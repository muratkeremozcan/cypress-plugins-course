export {}
declare global {
  namespace Cypress {
    interface Chainable {
      visitAndReset(): Chainable<any>
      clearSurvey(): Chainable<any>
      clearItems(): Chainable<any>
    }
  }
}
