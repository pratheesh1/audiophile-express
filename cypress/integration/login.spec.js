/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Render login page", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/login");
    cy.headerAndFooterVisible();
  });

  //test login page renders correctly
  it("should display login page", () => {
    cy.url().should("include", "/users/login");
    cy.contains("Login to your account").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("Login").should("be.visible");
    cy.contains("Don't have an account? Register now!").should("be.visible");
  });
});

describe("show error message when email or password is invalid", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/login");
  });
  //test it displays error message when email is empty
  it("should display error message when email is empty", () => {
    cy.contains("button", "Login").click();
    cy.contains("Invalid email or password! Please try again!").should(
      "be.visible"
    );
  });

  //test it displays error message when password is empty
  it("should display error message when password is empty", () => {
    cy.contains("button", "Login").click();
    cy.contains("Invalid email or password! Please try again!").should(
      "be.visible"
    );
  });
});

//test it redirects to login page if user is not logged in
describe("Redirects to login page if user is not logged in", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/");
  });

  it("should redirect to login page if user is not logged in and click Your Listings", () => {
    cy.get('[href="/products/home"]').click();
    cy.contains("Please login to access this page.").should("be.visible");
    cy.url().should("include", "/users/login");
  });

  it("should redirect to login page if user is not logged in and click All Listings", () => {
    cy.get('[href="/products"]').click();
    cy.contains("Please login to access this page.").should("be.visible");
    cy.url().should("include", "/users/login");
  });

  it("should redirect to login page if user is not logged in and click Add Product", () => {
    cy.get('[href="/products/add"]').click();
    cy.contains("Please login to access this page.").should("be.visible");
    cy.url().should("include", "/users/login");
  });
  it("should redirect to login page if user is not logged in and click Orders", () => {
    cy.get('[href="/orders"]').click();
    cy.contains("Please login to access this page.").should("be.visible");
    cy.url().should("include", "/users/login");
  });
});
