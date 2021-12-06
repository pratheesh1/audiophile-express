/// <reference types="Cypress" />

import Chance from "chance";
const chance = new Chance();

describe("Render Home Page", () => {
  it("renders the home page", () => {
    cy.login();
    cy.visit("/products/home");
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
    cy.visit("/products/home");
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
    cy.visit("/products/home");
    cy.get(".fa-eye").should("be.visible");
    cy.get(".fa-edit").should("be.visible");
    cy.get(".fa-trash-alt").should("be.visible");
  });

  it("renders the filer menu properly", () => {
    cy.login();
    cy.visit("/products/home");
    cy.contains("Advanced Filter:").should("be.visible");
    cy.contains("button", "Filter Products").should("be.visible");
    cy.get('[href="/products/home"]').contains("Reset").should("be.visible");
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

describe("Filter Products", () => {
  const product = chance.word({ length: 10 });
  beforeEach(() => {
    cy.login();
    cy.visit("/products/home");
    cy.scrollTo(0, 0);
  });

  it("filters products by name", () => {
    cy.get("input[id='id_name']").type(product);
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "name");
    cy.url().should("include", product);
  });

  it("filters products by brand", () => {
    cy.get("select[id='id_brand']").select(["1", "2", "5"]);
    cy.contains("button", "Filter Products").click();
    cy.url()
      .should("include", "brand=1")
      .should("include", "brand=2")
      .should("include", "brand=5");
  });

  it("filters products by category", () => {
    cy.get("select[id='id_category']").select(["1", "2", "8"]);
    cy.contains("button", "Filter Products").click();
    cy.url()
      .should("include", "category=1")
      .should("include", "category=2")
      .should("include", "category=8");
  });

  it("filters products by cost min", () => {
    cy.get("input[id='id_cost_min']").type("1");
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "cost_min=1");
  });

  it("filters products by cost max", () => {
    cy.get("input[id='id_cost_max']").type("1");
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "cost_max=1");
  });

  it("filters products by minimum stock", () => {
    cy.get("input[id='id_stock_min']").type("1");
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "stock_min=1");
  });

  it("filters products by sku", () => {
    cy.get("input[id='id_sku']").type("1");
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "sku=1");
  });

  it("filters products by custom tag", () => {
    cy.get("input[id='id_customTag']").type("1");
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "customTag=1");
  });

  it("filters products by bluetooth", () => {
    cy.get("input[id='id_bluetooth_1']").check();
    cy.get("input[id='id_bluetooth_0']").check();

    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "bluetooth=0").should("include", "bluetooth=1");
  });

  it("filters products by impedance range", () => {
    cy.get("select[id='id_impedanceRangeId']").select(["1", "2", "5"]);
    cy.contains("button", "Filter Products").click();
    cy.url()
      .should("include", "impedanceRangeId=1")
      .should("include", "impedanceRangeId=2")
      .should("include", "impedanceRangeId=5");
  });

  it("filters products by frequency response", () => {
    cy.get("select[id='id_frequencyResponseId']").select(["1", "2", "5"]);
    cy.contains("button", "Filter Products").click();
    cy.url()
      .should("include", "frequencyResponseId=1")
      .should("include", "frequencyResponseId=2")
      .should("include", "frequencyResponseId=5");
  });
});

describe("Reset Filter", () => {
  const product = chance.word({ length: 10 });

  beforeEach(() => {
    cy.login();
    cy.visit("/products/home");
    cy.scrollTo(0, 0);
  });

  it("resets the filter", () => {
    cy.get("input[id='id_name']").type(product);
    cy.contains("button", "Filter Products").click();
    cy.url().should("include", "name");
    cy.url().should("include", product);

    cy.get('[href="/products/home"]').contains("Reset").click();
    cy.url()
      .should("not.include", "name")
      .should("not.include", "brand")
      .should("not.include", "category")
      .should("not.include", "cost_min")
      .should("not.include", "cost_max")
      .should("not.include", "stock_min")
      .should("not.include", "sku")
      .should("not.include", "customTag")
      .should("not.include", "bluetooth")
      .should("not.include", "impedanceRangeId")
      .should("not.include", "frequencyResponseId")
      .should("include", "/products/home");
  });
});

describe("Delete Product", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/products/home");
    cy.scrollTo(0, 0);
  });

  it("asks for confirmation before deleting a product", () => {
    cy.get(".fa-trash-alt").first().click();
    cy.contains(
      "Are you sure you want to delete this listing? This action cannot be undone."
    ).should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
    cy.contains("Confirm Deletion").should("be.visible");
  });

  it("cancels deletion", () => {
    cy.get(".fa-trash-alt").first().click();
    cy.contains("Cancel").click();
    cy.contains("Are you sure you want to delete this listing?").should(
      "not.be.visible"
    );
  });

  it("deletes a product", () => {
    cy.get(".fa-trash-alt").each(($el, index, $list) => {
      //test 5 products
      if (index < 5) {
        cy.get(".fa-trash-alt").eq(index).click();
        cy.get(".delete-confirmation").should("be.visible").first().click({
          force: true,
        });
        if (cy.get("body").contains("Error")) {
          cy.contains(
            "This product has orders associated with it and cannot be deleted."
          ).should("be.visible");
        } else {
          cy.contains(" Product deleted successfully!").should("be.visible");
        }
      }
    });
  });

  it("prevents unauthorized deletion", () => {
    cy.fixture("product").as("product");

    //manually try to delete products
    cy.get("@product").then((product) => {
      product.productId.length &&
        product.productId.forEach((id) => {
          cy.visit(`/products/${id}/delete`);
          cy.contains("Product deleted successfully!").should("be.visible");
        });

      product.noAccessProductId.length &&
        product.noAccessProductId.forEach((id) => {
          cy.visit(`/products/${id}/delete`);
          cy.contains(
            " You do not have permission to delete this product."
          ).should("be.visible");
        });
    });
  });
});

describe("Edit Product", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/products/home");
    cy.scrollTo(0, 0);
  });

  it("renders the edit product form", () => {
    cy.get(".fa-edit").first().click();
    cy.contains("Edit Product").should("be.visible");
    cy.contains("Cancel").should("be.visible");
    cy.contains("Update and Continue").should("be.visible");
    cy.url().should("include", "/edit");
  });

  it("cancels editing a product", () => {
    cy.get(".fa-edit").first().click();
    cy.contains("Cancel").click();
    cy.contains("Update and Continue").should("not.exist");
    cy.url().should("not.include", "/edit");
  });

  //product form is same as create product form
  //therefore, no need to test it, only testing navigation
  it("updates a product", () => {
    cy.get(".fa-edit").first().click();
    cy.contains("Update and Continue").click();
    cy.contains("Product edited successfully!").should("be.visible");
    cy.url().should("include", "/image");
    cy.contains("Add Images").click({
      force: true,
    });
    cy.url().should("include", "/tag");
    cy.contains("Done").click({
      force: true,
    });
    cy.url().should("include", "/products/home");
  });

  it("prevents unauthorized editing", () => {
    cy.fixture("product").as("product");

    //manually try to edit products
    cy.get("@product").then((product) => {
      product.noAccessProductId.length &&
        product.noAccessProductId.forEach((id) => {
          cy.visit(`/products/${id}/edit`);
          cy.contains("You do not have permission to edit this product").should(
            "be.visible"
          );
        });
    });
  });
});
