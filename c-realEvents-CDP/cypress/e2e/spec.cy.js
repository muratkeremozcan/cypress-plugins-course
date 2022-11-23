// https://cypress.tips/courses/cypress-plugins/lessons/lebhy6ifdi

// Since we don't have a support file and only need the real events in this one spec,
// we can import the plugin's support file from the spec file
import 'cypress-real-events/support'

it(
  'shows the copy code button',
  { browser: '!firefox', scrollBehavior: 'center', timeout: 10000 },
  () => {
    cy.visit('dmtrKovalenko/cypress-real-events')
    cy.contains('h2', 'Installation').scrollIntoView()

    cy.contains('.snippet-clipboard-content', 'npm install').within(() => {
      cy.get('[aria-label=Copy]')
        .should('not.be.visible')
        .should('have.attr', 'data-copy-feedback')
        .then((copyText) => {
          cy.root().realHover()
          cy.get('[aria-label=Copy]').should('be.visible').realClick()
          // the SVG tooltip shows the text "Copied!"
          // using its ::after CSS content
          cy.get('.tooltipped')
            .should('be.visible')
            .then(($el) => {
              const after = window.getComputedStyle($el[0], '::after')
              const afterContent = after.getPropertyValue('content')
              // the ::after content has double quotes
              expect(afterContent, 'tooltip text').to.equal(
                '"' + copyText + '"',
              )
            })
          // then the tooltip goes away from the DOM completely
          cy.get('.tooltipped').should('not.exist')
        })
    })

    cy.task('readClipboard').should(
      'equal',
      'npm install cypress-real-events\n\nyarn add cypress-real-events',
    )
  },
)

it('uses cy.stub to stub the clipboard', { timeout: 10000 }, () => {
  cy.visit('dmtrKovalenko/cypress-real-events')
  cy.contains('h2', 'Installation').scrollIntoView()

  // stub clipboard functionality
  cy.window()
    .its('navigator.clipboard')
    .then((clipboard) =>
      cy.stub(clipboard, 'writeText').as('writeText').resolves(),
    )
  // we can use a spy but  even with real click or synthetic click the native api can causes problems, stub makes it safer
  // .then((clipboard) => cy.spy(clipboard, 'writeText').as('writeText'))

  // alternative: add your own event listener // https://cypress.tips/courses/cypress-plugins/lessons/le9nb1ja1h
  cy.document().invoke(
    'addEventListener',
    'clipboard-copy',
    cy.stub().as('copyEvent'),
  )

  cy.contains('.snippet-clipboard-content', 'npm install').within(() => {
    cy.root().realHover()
    cy.get('[aria-label=Copy]').should('be.visible').click()

    cy.get('@writeText').should(
      'be.calledOnceWithExactly',
      'npm install cypress-real-events\n\nyarn add cypress-real-events',
    )

    // alternative: check the event
    cy.get('@copyEvent').should('have.been.calledOnce')
  })
})
