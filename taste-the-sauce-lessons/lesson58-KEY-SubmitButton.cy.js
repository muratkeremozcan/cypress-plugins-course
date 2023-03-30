// import the submit button component
import SubmitButton from './SubmitButton'

it('shows the submit button', () => {
  // mount the SubmitButton
  // passing value, custom class, and test id props
  cy.mount(
    <SubmitButton
      value="Submit"
      className="submit-button"
      testId="submit-button"
    />,
  )
  //
  // confirm the component appears on the page
  // and has the expected value and attributes
  cy.get('[data-test="submit-button"]')
    .should('have.class', 'submit-button')
    .and('have.value', 'Submit')
    .and('have.attr', 'data-test', 'submit-button')
})
