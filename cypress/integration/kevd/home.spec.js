describe("Sample Test", function() {
  beforeEach(() => {
    cy.viewport("iphone-6");
    cy.wait(200);
    cy.visit("/");
  });

  it("Has Home screen with action items", function() {
    cy.contains("行き先を探す");
    cy.contains("暇つぶし");
    cy.contains("充電する");
  });

  it("Can open Search destination screen and display search menu", function() {
    cy.contains("行き先を探す").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/map");
    cy.get(".input-group")
      .should("be.visible")
      .click();
    cy.get("#destination_text").should("be.visible");

    cy.contains("TOPへ").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    /* Later steps are not runnable as Cypress cannot force the browser to accept geolocation popup now.
       https://github.com/cypress-io/cypress/issues/2671

      .type("新横浜");
    cy.get("#destination_search").click();
    cy.wait(5000);
    cy.get("#destination_text").should("be.hidden");
    */
  });
});
