describe("GET call using environment variable", () => {
    it("Fetches data using a valid DID", () => {
      const did = Cypress.env("did") || "did:web:ashwin.myn.social"; // Default value if env var is not set
  
      cy.request({
        method: "GET",
        url: `/did/resolve-did-doc?did=${did}`, 
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log("Valid DID Response: ", JSON.stringify(response.body));
      });
    });
  
    
    it("Fetches data using an invalid DID", () => {
      cy.request({
        method: "GET",
        url: `/did/resolve-did-doc?did=did:web:sree.myn.social`, 
        failOnStatusCode: false, // Prevents Cypress from failing on 404
      }).then((response) => {
        expect(response.status).to.eq(404);
        cy.log("Invalid DID Response: ", JSON.stringify(response.body));
      });
    });
  });
  