/// <reference types="Cypress" />

describe("Orders", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/orders");
  });

  it("should display orders", () => {
    cy.get("table").should("exist");
    cy.contains("Manage Orders").should("exist");
    cy.contains("Order ID").should("exist");
    cy.contains("Date").should("exist");
    cy.contains("Customer").should("exist");
    cy.contains("Ship To").should("exist");
    cy.contains("Actions").should("exist");
    cy.contains("Order Details: #").should("exist");

    cy.get(".fa-eye").should("exist").should("be.visible");
    cy.get(".fa-edit").should("exist").should("be.visible");
  });

  it("should display order details", () => {
    cy.get(".fa-eye").each(($el, index) => {
      cy.wrap($el).click();
      cy.contains("Order Total:").should("exist");
      cy.contains("Product Name:").should("exist");
      cy.contains("Current Status:").should("exist");
      cy.contains("Order Quantity:").should("exist");
      cy.contains("Purchased At:").should("exist");

      if (cy.get("body").find("select")) {
        cy.contains("Current Status: Completed").should("not.exist");
      } else {
        cy.contains("Current Status: Completed").should("exist");
      }
    });
  });

  it("should update order status", () => {
    cy.get(".fa-edit").each(($el, index) => {
      cy.wrap($el).click();
      cy.get("select").select("Processing");
      cy.get("button").contains("Update").click();
      cy.contains("Current Status: Processing").should("exist");

      cy.get("select").select("Shipped");
      cy.get("button").contains("Update").click();
      cy.contains("Current Status: Shipped").should("exist");

      cy.get("select").select("Completed");
      cy.get("button").contains("Update").click();
      cy.contains("Current Status: Completed").should("exist");
      cy.get("button").contains("Update").should("not.exist");
    });
  });
});
