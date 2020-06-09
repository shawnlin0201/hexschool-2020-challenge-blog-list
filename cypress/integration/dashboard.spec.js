/// <reference types="cypress" />

const lists = require("../fixtures/dashboard");

describe("DASHBOARD - ", () => {
  before(() => {
    cy.server();
    cy.route(
      "https://raw.githubusercontent.com/hexschool/w3hexschool-API/master/data.json",
      lists
    );
    cy.visit("/");
  });
  afterEach(() => {
    cy.get(".list-group > .search-label").click({ force: true });
    cy.get(".keyword-group > .search-input").clear({ force: true });
    cy.get(".list-group > :nth-child(2)").click({ force: true });
  });

  it("Checks items of lists", () => {
    cy.get(".list-wrapper .card-wrapper").each((item, index) => {
      cy.wrap(item).should("contain.text", lists[index].name);
    });
  });

  it("Search bar", () => {
    cy.get(".keyword-group > .search-input").type("Monad", { force: true });
    cy.get(".list-wrapper").should("contain.text", "Monad");
  });

  it("Add to favorite", () => {
    cy.get(".list-wrapper .card-wrapper").each((item, index) => {
      if (index < 2) {
        cy.wrap(item)
          .find(".info-subscribe")
          .click({ force: true });
      }
    });

    cy.get(".list-group > :nth-child(3)").click({ force: true });

    cy.get(".list-wrapper .card-wrapper")
      .should("contain.text", "Sealman")
      .and("contain.text", "Hannah Lin");
  });

  describe("Change ORDER - ", () => {
    it("Descending by posts", () => {
      cy.get(".search-select > :nth-child(1)").click({ force: true });
      cy.get(".list-wrapper .card-wrapper")
        .eq(0)
        .should("contain.text", "Hannah Lin");
    });
    it("Ascending by posts", () => {
      cy.get(".search-select > :nth-child(2)").click({ force: true });
      cy.get(".list-wrapper .card-wrapper")
        .eq(0)
        .should("contain.text", "C.H.");
    });
    it("Oldest date", () => {
      cy.get(".search-select > :nth-child(3)").click({ force: true });
      cy.get(".list-wrapper .card-wrapper")
        .eq(0)
        .should("contain.text", "Sealma");
    });
    it("Latest date", () => {
      cy.get(".search-select > :nth-child(4)").click({ force: true });
      cy.get(".list-wrapper .card-wrapper")
        .eq(0)
        .should("contain.text", "Hannah Lin");
    });
  });
});
