/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Render login page", () => {
  beforeEach(() => {
    cy.visit("/users/login");
    cy.scrollTo(0, 0);
    cy.headerAndFooterVisible();
  });

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
    cy.visit("/users/login");
    cy.scrollTo(0, 0);
  });

  it("should display error message when email is empty", () => {
    cy.contains("button", "Login").click();
    cy.contains("Invalid email or password! Please try again!").should(
      "be.visible"
    );
  });

  it("should display error message when password is empty", () => {
    cy.contains("button", "Login").click();
    cy.contains("Invalid email or password! Please try again!").should(
      "be.visible"
    );
  });

  it("should display error when credentials are invalid", () => {
    const email = chance.email();
    const password = chance.string({ length: 8 });
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type(password);
    cy.contains("button", "Login").click();
    cy.contains("Invalid email or password! Please try again!").should(
      "be.visible"
    );
  });
});

describe("Redirects to login page if user is not logged in", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.scrollTo(0, 0);
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

describe("Login with valid credentials", () => {
  beforeEach(() => {
    cy.visit("/users/login");
    cy.scrollTo(0, 0);
    cy.fixture("credentials").as("credentials");
  });

  it("should login with valid credentials", () => {
    cy.get("@credentials").then((credentials) => {
      cy.get("input[name='email']").type(credentials.email);
      cy.get("input[name='password']").type(credentials.password);
      cy.get("button").contains("Login").click();
      cy.url().should("include", "/products");
    });
  });

  it("should display welcome message", () => {
    cy.get("@credentials").then((credentials) => {
      cy.get("input[name='email']").type(credentials.email);
      cy.get("input[name='password']").type(credentials.password);
      cy.get("button").contains("Login").click();
      cy.contains("Login successful! Welcome back").should("be.visible");
    });
  });

  it("should not display login and signup buttons", () => {
    cy.get("@credentials").then((credentials) => {
      cy.get("input[name='email']").type(credentials.email);
      cy.get("input[name='password']").type(credentials.password);
      cy.get("button").contains("Login").click();
      cy.get('[href="/users/login"]').should("not.exist");
      cy.get('[href="/users/register"]').should("not.exist");
    });
  });
});

describe("Logout user", () => {
  beforeEach(() => {
    cy.visit("/users/login");
    cy.scrollTo(0, 0);
    cy.fixture("credentials").as("credentials");

    cy.get("@credentials").then((credentials) => {
      cy.get("input[name='email']").type(credentials.email);
      cy.get("input[name='password']").type(credentials.password);
      cy.get("button").contains("Login").click();
      cy.url().should("include", "/products");
    });
  });
  it("user is able to logout", () => {
    cy.get("#user-menu-dropdown").click();
    cy.get('.absolute > [href="/products/home"]').should("be.visible");
    cy.get('.absolute > [href="/users/logout"]').click();
    cy.contains("You have successfully logged out!").should("be.visible");
    cy.url().should("include", "/users/login");
  });
});

describe("Accessing pages when user is logged in", () => {
  beforeEach(() => {
    cy.login();
    cy.scrollTo(0, 0);
  });

  it("should redirect home page if the user is logged in and access /loggin", () => {
    cy.visit("users/login");
    cy.url().should("include", "/products");
  });

  it("should redirect home page if the user is logged in and access /register", () => {
    cy.visit("users/register");
    cy.url().should("include", "/products");
  });

  it("should be able to access protected routes after login", () => {
    cy.visit("/products/home");
    cy.url().should("include", "/products");

    cy.visit("/products");
    cy.url().should("include", "/products");

    cy.visit("/products/add");
    cy.url().should("include", "/products");

    cy.visit("/orders");
    cy.url().should("include", "/orders");
  });
});
