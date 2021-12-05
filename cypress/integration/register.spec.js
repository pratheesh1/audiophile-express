/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Renders register page", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/register");
    cy.headerAndFooterVisible();
  });

  it("Renders register page", () => {
    cy.contains("First name").should("be.visible");
    cy.contains("Last name").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
    cy.contains("Confirm Password").should("be.visible");
    cy.contains("button", "Register").should("be.visible");
    cy.contains("Already have an account? Login").should("be.visible");
  });
});

describe("Show error message when filed inputs are empty or invalid", () => {
  const firstName = chance.first();
  const lastName = chance.last();
  const email = chance.email();

  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/register");
  });

  it("show error message when first name is empty", () => {
    cy.get("button").contains("Register").click();
    cy.contains("First name: is required.").should("be.visible");
  });

  it("show error message when last name is empty", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("button").contains("Register").click();
    cy.contains("Last name: is required.").should("be.visible");
  });

  it("show error message when email is empty", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("button").contains("Register").click();
    cy.contains("Email: is required.").should("be.visible");
  });

  it("show error message when password is empty", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("button").contains("Register").click();
    cy.contains("Password: is required.").should("be.visible");
  });

  it("checks length of password", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("pass");
    cy.get("button").contains("Register").click();
    cy.contains("Password must be at least 8 characters long!").should(
      "be.visible"
    );
  });

  it("show error message when confirm password is empty", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("password");
    cy.get("button").contains("Register").click();
    cy.contains("Confirm Password: is required.").should("be.visible");
  });

  it("show error message when password and confirm password do not match", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("password");
    cy.get("input[name='confirmPassword']").type("password1");
    cy.get("button").contains("Register").click();
    cy.contains("Passwords do not match!").should("be.visible");
  });
});

describe("Show error message when email is already registered", () => {
  const firstName = chance.first();
  const lastName = chance.last();
  const email = "john@geemail.com";

  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/register");
  });

  it("show error message when email is already registered", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("password");
    cy.get("input[name='confirmPassword']").type("password");
    cy.get("button").contains("Register").click();
    cy.contains(
      " An account associated with this email already exist! Please use another email or login to continue!"
    ).should("be.visible");
  });
});

describe("Register user", () => {
  const firstName = chance.first();
  const lastName = chance.last();
  const email = chance.email();
  const password = "password";

  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.visit("/users/register");
  });

  it("registers new user and redirects to login", () => {
    cy.get("input[name='firstName']").type(firstName);
    cy.get("input[name='lastName']").type(lastName);
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.get("input[name='confirmPassword']").type(password);
    cy.get("button").contains("Register").click();
    cy.contains(
      "You have successfully registered! You may want to verify your email by clicking the link in the email we sent you."
    ).should("be.visible");
    cy.contains("Login").should("be.visible");
    cy.url().should("include", "/users/login");
  });
});
