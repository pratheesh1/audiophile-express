/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Add Product Renders Correctly", () => {
  beforeEach(() => {
    cy.login();
    cy.contains("Add Product").click();
    cy.scrollTo(0, 0);
  });

  it("add product renders correctly", () => {
    cy.contains("Add new Product:").should("be.visible");
    cy.contains(" Fields marked with * are required.").should("be.visible");

    cy.contains("Product Name").should("be.visible");
    cy.get("input[name=name]").should("be.visible");

    cy.contains("Description").should("be.visible");
    cy.get("textarea[name=description]").should("be.visible");

    cy.contains("Base Cost").should("be.visible");
    cy.get("input[name=baseCost]").should("be.visible");

    cy.contains("Brand").should("be.visible");
    cy.get("select[name=brandId]").should("be.visible");

    cy.contains("Category").should("be.visible");
    cy.get("select[name=categoryId]").should("be.visible");

    cy.contains("Stock").should("be.visible");
    cy.get("input[name=stock]").should("be.visible");

    cy.contains("SKU").should("be.visible");
    cy.get("input[name=sku]").should("be.visible");

    cy.contains("Frequency Response").should("be.visible");
    cy.get("select[name=frequencyResponseId]").should("be.visible");

    cy.contains("Bluetooth").should("be.visible");
    cy.get("input[name='bluetooth']").should("be.visible");

    cy.contains("Impedance Range").should("be.visible");
    cy.get("select[name=impedanceRangeId]").should("be.visible");

    cy.get("button").contains("Upload Image").should("be.visible");
    cy.get('[href="/products/home"]').contains("Cancel").should("be.visible");
    cy.get("button").contains("Add Product").should("be.visible");
  });
});

describe("Form Validation", () => {
  const productName = chance.string({ length: 10 });
  const productDescription = chance.string({ length: 10 });
  const productBaseCost = chance.integer({ min: 1, max: 10000 });
  const productStock = chance.integer({ min: 1, max: 10000 });

  beforeEach(() => {
    cy.login();
    cy.contains("Add Product").click();
    cy.scrollTo(0, 0);
  });

  it("validates mandatory inputs", () => {
    cy.get("button").contains("Add Product").click();
    cy.contains("Product Name:* is required.").should("be.visible");

    cy.get("input[name=name]").type(productName);
    cy.get("button").contains("Add Product").click();
    cy.contains("Description:* is required.").should("be.visible");

    cy.get("textarea[name=description]").type(productDescription);
    cy.get("button").contains("Add Product").click();
    cy.contains("Base Cost:* is required.").should("be.visible");

    cy.get("input[name=baseCost]").type(productBaseCost);
    cy.get("button").contains("Add Product").click();
    cy.contains("Brand:* is required.").should("be.visible");

    cy.get("select[name=brandId]").select("1");
    cy.get("button").contains("Add Product").click();
    cy.contains("Category:* is required.").should("be.visible");

    cy.get("select[name=categoryId]").select("1");
    cy.get("button").contains("Add Product").click();
    cy.contains("Stock:* is required.").should("be.visible");

    cy.get("input[name=stock]").type(productStock);
    cy.get("button").contains("Add Product").click();

    cy.url().should("include", "/products/add/image/");
    cy.contains("New product listing added successfully.").should("be.visible");
  });
});

describe("Image Upload", () => {
  beforeEach(() => {
    cy.login();
    cy.contains("Add Product").click();
    cy.scrollTo("bottom");
  });

  it("uploads image", () => {
    cy.get("button").contains("Upload Image").click();

    //manually upload image
    cy.pause();

    cy.get("img[id='uploaded_image']").should("be.visible");
  });
});

describe("Add Images", () => {
  beforeEach(() => {
    cy.login();
    cy.contains("Add Product").click();
    cy.scrollTo("bottom");
  });

  it("renders add image form correctly", () => {
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

    cy.url().should("include", "/products/add/image/");
    cy.contains("New product listing added successfully.").should("be.visible");
    cy.get("button").contains("Upload More").should("be.visible");
    cy.get("button").contains("Add Images").should("be.visible");
    cy.get('[href="/products/home"]').contains("Cancel").should("be.visible");

    cy.contains("Upload Image").should("be.visible");
    cy.contains("Adding more images").should("be.visible");
    cy.contains(productName).should("be.visible");
    cy.contains(" Fields marked with * are required.").should("be.visible");
  });
});

describe("Add More Images", () => {
  beforeEach(() => {
    cy.addProduct();
  });

  it("adds more images", () => {
    cy.get("button").contains("Upload More").click();

    //manually upload image
    cy.pause();

    cy.get(".swiper").should("be.visible");
    cy.contains("Remove Image").should("be.visible");
  });
});

describe("Remove Image", () => {
  beforeEach(() => {
    cy.addProduct();
  });

  it("removes image", () => {
    cy.get("button").contains("Upload More").click();

    //manually upload image
    cy.pause();

    cy.get(".swiper").should("be.visible");
    cy.contains("Remove Image").should("be.visible");

    //for each image, click remove image
    cy.get("#image-list>div").each(($el, index, $list) => {
      cy.get("div").contains("Remove Image").click();
    });

    cy.contains("Remove Image").should("not.exist");
  });
});

describe("Add Tags", () => {
  beforeEach(() => {
    cy.addProduct();
    cy.get("button").contains("Add Images").click();
  });

  it("renders add tags form correctly", () => {
    cy.get("button").contains("Add New Tag").should("be.visible");
    cy.get('[href="/products/home"]').contains("Cancel").should("be.visible");
    cy.get('[href="/products/home"]').contains("Done").should("be.visible");
    cy.contains("Adding custom tags for").should("be.visible");
    cy.get("input[name=tagName]").should("be.visible");
    cy.get("input[name=tagValue]").should("be.visible");
    cy.get("textarea[name=tagDescription]").should("be.visible");
  });

  it("validates inputs", () => {
    cy.get("button").contains("Add New Tag").click();
    cy.contains("Tag Name:* is required.").should("be.visible");

    cy.get("input[name=tagName]").type(chance.string({ length: 10 }));
    cy.get("button").contains("Add New Tag").click();
    cy.contains("Tag Value:* is required.").should("be.visible");
  });

  it("adds tags", () => {
    const tagName = chance.string({ length: 10 });
    const tagValue = chance.string({ length: 10 });
    const tagDescription = chance.string({ length: 10 });

    cy.get("input[name=tagName]").type(tagName);
    cy.get("input[name=tagValue]").type(tagValue);
    cy.get("textarea[name=tagDescription]").type(tagDescription);
    cy.get("button").contains("Add New Tag").click();

    cy.contains(tagName).should("be.visible");
    cy.contains(tagValue).should("be.visible");
    cy.contains(tagDescription).should("be.visible");
    cy.contains("Tag added successfully!").should("be.visible");
  });

  it("removes tags", () => {
    cy.addTag();
    cy.get(".fa-times").each(($el, index, $list) => {
      cy.get(".fa-times").click();
    });
    cy.get(".fa-times").should("not.exist");
    cy.contains("Tag deleted successfully!").should("be.visible");
  });
});
