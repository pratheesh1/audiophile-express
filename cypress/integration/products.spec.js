/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Render Products Page", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
  });
  it("renders the products page", () => {
    cy.login();
    cy.visit("/products");
    cy.contains("Filter Products:").should("be.visible");
    cy.get('[href="/products/add"]').should("be.visible");
    cy.get("table").should("be.visible");
    cy.get("table").find("tr").should("have.length.greaterThan", 1);

    cy.get("table")
      .find("thead")
      .find("tr")
      .find("th")
      .should("have.length", 9);
  });

  it("renders the table properly", () => {
    cy.login();
    cy.visit("/products");
    cy.get("table")
      .find("thead")
      .find("tr")
      .find("th")
      .should("have.length", 9);
    cy.get("table")
      .find("thead")
      .find("tr")
      .find("th")
      .should("contain", "ID")
      .should("contain", "Name")
      .should("contain", "Cost")
      .should("contain", "Image")
      .should("contain", "Brand")
      .should("contain", "Category")
      .should("contain", "Custom Tag")
      .should("contain", "Stock")
      .should("contain", "Actions");
  });

  it("renders view, update and delete buttons", () => {
    cy.login();
    cy.visit("/products");
    cy.get(".fa-eye").should("be.visible");
    cy.get(".fa-edit").should("be.visible");
    cy.get(".fa-trash-alt").should("be.visible");
  });

  it("renders the filer menu properly", () => {
    cy.login();
    cy.visit("/products");
    cy.contains("Advanced Filter:").should("be.visible");
    cy.contains("button", "Filter Products").should("be.visible");
    cy.get('[href="/products"]').contains("Reset").should("be.visible");
    cy.contains("Product Name:").should("be.visible");
    cy.contains("Brands:").should("be.visible");
    cy.contains("Category:").should("be.visible");
    cy.contains("Cost Min:").should("be.visible");
    cy.contains("Cost Max:").should("be.visible");
    cy.contains("Minimum Stock:").should("be.visible");
    cy.contains("SKU:").should("be.visible");
    cy.contains("Custom Tag:").should("be.visible");
    cy.contains("Bluetooth:").should("be.visible");
    cy.contains("Impedance Range:").should("be.visible");
    cy.contains("Frequency Response:").should("be.visible");
  });
});

//rest of features are tested in the home.spec.js file since it is the same page
