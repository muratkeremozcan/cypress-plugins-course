// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />
import "cypress-if";

it("closes the cookie banner", () => {
  cy.visit("index.html");
  cy.get("aside.banner").should("be.visible");
  cy.contains("button", "Agree").click();
  cy.get("aside.banner").should("not.be.visible");
  // confirm the cookie consent was set
  // Tip: inspect the application tab in the DevTools
  cy.getCookie("cookieConsent").should("deep.include", {
    name: "cookieConsent",
    value: "given",
  });
});

it("prevents the cookie banner from showing up", () => {
  cy.setCookie("cookieConsent", "given");
  cy.visit("index.html");
  cy.get("aside.banner").should("not.be.visible");
});

it("once closed it stays hidden", () => {
  cy.visit("index.html");
  cy.get("aside.banner").should("be.visible");
  cy.contains("button", "Agree").click();
  cy.get("aside.banner").should("not.be.visible");
  cy.reload();
  cy.get("aside.banner").should("not.be.visible");
});

function closeTheCookieBanner() {
  // check if the banner is visible
  // if yes, click the "Agree" button
  // else do nothing
  cy.get(".banner").if("visible").find("button").click();
  // confirm the banner is not visible
  cy.get(".banner").should("not.be.visible");
}

it("closes the cookie banner", () => {
  cy.visit("index.html");
  closeTheCookieBanner();
  // confirm the banner stays closed
  // by reloading the page
  cy.reload();
  // but we still can call the utility function
  // and it should do nothing if there is no banner
  closeTheCookieBanner();
});

it("removes the cookie if it exists to force the banner to appear", () => {
  // uncomment to set the cookie
  // and force the "IF(exist)" commands path
  cy.visit("index.html");
  cy.contains("button", "Agree").click();
  //
  // get the cookie named "cookieConsent"
  // and if it exists, clear it
  // https://on.cypress.io/getcookie
  // https://on.cypress.io/clearcookie
  // if the cookie does not exist
  // log "No cookie" to the Command Log
  cy.getCookie("cookieConsent")
    .if("exist")
    .clearCookie("cookieConsent")
    .else()
    .log("No cookie");

  // visit the "index.html" and confirm
  // the cookie consent banner is visible
  cy.visit("index.html");
  cy.get("aside.banner").should("be.visible");
});
