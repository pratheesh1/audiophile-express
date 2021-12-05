// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import Chance from "chance";
const chance = new Chance();

Cypress.Commands.add("headerAndFooterVisible", () => {
  cy.get("nav").should("be.visible");
  cy.get("footer").should("be.visible");
});

Cypress.Commands.add("login", () => {
  cy.fixture("credentials").as("credentials");
  cy.get("@credentials").then((credentials) => {
    cy.visit("/users/login");
    cy.get("input[name='email']").type(credentials.email);
    cy.get("input[name='password']").type(credentials.password);
    cy.get("button").contains("Login").click();
  });
});

Cypress.Commands.add("addProduct", () => {
  cy.login();
  cy.visit("/products/add");
  const productName = chance.string({ length: 10 });
  const productDescription = chance.string({ length: 10 });
  const productBaseCost = chance.integer({ min: 1, max: 10000 });
  const productStock = chance.integer({ min: 1, max: 10000 });

  cy.get("input[name=name]").type(productName);
  cy.get("textarea[name=description]").type(productDescription);
  cy.get("input[name=baseCost]").type(productBaseCost);
  cy.get("select[name=brandId]").select("1");
  cy.get("select[name=categoryId]").select("1");
  cy.get("input[name=stock]").type(productStock);
  cy.get("select[name=frequencyResponseId]").select("1");
  cy.get("input[name='bluetooth']").check();
  cy.get("select[name=impedanceRangeId]").select("1");
  cy.get("button").contains("Add Product").click();
});

Cypress.Commands.add("addProductAndImage", () => {
  cy.addProduct();
  cy.get("button").contains("Add Images").click();
});
