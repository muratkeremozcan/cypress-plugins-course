/*
we can instead use a jsconfig.json file
/// <reference types="cypress" />
/// <reference types="cypress-get-by-label" />
*/

// overwrite the cy.log to include print to terminal
// Cypress.Commands.overwrite('log', (log, message, ...args) => {
//   // print the to Cypress Command Log
//   // to preserve the existing functionality
//   log(message, ...args)
//   // send the formatted message down to the Node
//   // callback in the cypress.config.js to be printed to the terminal
//   cy.task('print', [message, ...args].join(', '), { log: false })
// })
// import 'cypress-log-to-term/commands' // instead use cypress-log-to-term plugin
// import 'cypress-failed-log' // instead use cypress-failed-log plugin
// my personal favorite is cypress-terminal-report
// require('cypress-terminal-report/src/installLogsCollector')() // instead use cypress-terminal-report
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector' // import version
installLogsCollector()
import X2JS from 'x2js' // for xml to json conversion
import readXlsxFile from 'read-excel-file' // for reading excel files
import { slowCypressDown } from 'cypress-slow-down' // https://github.com/bahmutov/cypress-slow-down
import 'cypress-slow-down/commands' // register the custom commands cy.slowDown and cy.slowDownEnd
// adds timestamps to the cypress command log
require('cypress-timestamps/support')({
  commandLog: 'all',
  elapsed: true,
})

chai.config.truncateThreshold = 200

it('finds the input elements by their labels', () => {
  // path with respect to the root folder
  cy.visit('cypress/index.html')

  // find the element with the label "First name:"
  // and type "Joe"
  // Hint: use https://github.com/bahmutov/cypress-get-by-label
  //
  cy.log('enter the first name')
  cy.getByLabel('First name:').type('Joe')
  // cy.findByLabelText('First name:').type('Joe') // testing lib alternative
  // find the element with the label "Last name:"
  // and type "Smith"
  cy.log('enter the last name')
  cy.getByLabel('Last name:').type('Smith') // testing lib alternative

  // check the form inputs using jQuery method
  // https://api.jquery.com/serializeArray/
  // which returns an array of "name/value" objects
  // https://on.cypress.io/get
  // https://on.cypress.io/invoke
  // https://glebbahmutov.com/cypress-examples/commands/assertions.html
  cy.log('check the form values')
  cy.get('form')
    .invoke('serializeArray')
    .should('deep.equal', [
      { name: 'fname', value: 'Joe' },
      { name: 'lname', value: 'Smith' },
    ])

  cy.screenshot('form', { capture: 'runner', overwrite: true })
})

it('finds the input elements by their labels using XML list', () => {
  cy.visit('cypress/index.html')
  // load the list of labels from the "cypress/fixtures/labels.xml"
  // and parse it using "x2js" module

  cy.fixture('labels.xml')
    .then((xml) => {
      // you should get an array of objects
      // Tip: print the list into the DevTools console
      // using console.table method
      const parser = new X2JS()
      const json = parser.xml2js(xml)
      return json.labels.label
    })
    .then(console.table)
    // iterate over each label and confirm
    // the page has a label with that text
    // and the corresponding input field
    // has the expected id as listed in "labels.xml"
    .should('be.an', 'array')
    .each((label) =>
      cy.getByLabel(label.text).should('have.prop', 'id', label.id),
    )
})

it('finds the input elements by their labels using XLXS fixture', () => {
  slowCypressDown(100) // slows down the whole test
  cy.visit('cypress/index.html')
  // load the list of labels from the "cypress/fixtures/Input labels.xlsx"
  // convert binary encoding to array buffer
  // using Cypress.Blob
  // https://on.cypress.io/blob
  cy.slowDown(1000) // focused slow down
  cy.fixture('labels.xlsx', 'binary')
    .then(Cypress.Blob.binaryStringToArrayBuffer)
    // then pass the array buffer through readXlsxFile
    // Tip: you might need to slice off the first row with headings
    .then(readXlsxFile)
    .should('be.an', 'array')
    .invoke('slice', 1)
    .then(console.table) // same result as the xml test above
    // iterate over every array with [label, id] strings
    // https://on.cypress.io/each
    // and confirm the input found by the label text
    // has the expected ID attribute
    .each(([label, id]) => cy.getByLabel(label).should('have.prop', 'id', id))
  cy.slowDownEnd() // end focused slow down
})
