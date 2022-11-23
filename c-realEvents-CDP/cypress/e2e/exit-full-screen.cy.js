import 'cypress-real-events/support'
import 'cypress-cdp'

it('closes fullscreen', () => {
  cy.visit('https://www.highcharts.com/demo/line-basic')
  cy.contains('Allow all cookies').click()
  cy.get('[title="Chart context menu"]').click()
  cy.get('[class="highcharts-menu-item"]')
    .contains('View in full screen')
    .realClick()
    .wait(1000)

  cy.CDP('Input.dispatchKeyEvent', {
    type: 'keyDown',
    windowsVirtualKeyCode: 27,
    nativeVirtualKeyCode: 27,
  })
})
