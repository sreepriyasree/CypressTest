describe("GET Identity Resolve Test", () => {
    // Environment variable: 'did' stores the DID value
    const did = Cypress.env("did") || "did:web:ashwin.myn.social"; // Default if no env variable is provided
    const invalidDid = "did:web:invalid.myn.social"; // Example of an invalid DID
  
    it("should successfully resolve identity with a valid DID", () => {
        cy.request({
          method: "GET",
          url: `/did/resolve-did-doc?did=${did}`, // Using the dynamic DID
          failOnStatusCode: false, // Do not fail the test for non-200 status codes
        }).then((response) => {
          // Log the entire response body to understand its structure
          cy.log("Full Response:", JSON.stringify(response.body));
      
          // Assert status code is 200 (success)
          expect(response.status).to.eq(200);
      
          // Log the body of the response to inspect its structure
          cy.log("Response Body:", JSON.stringify(response.body));
          
          // Check if 'didDocument' is present in the response
          if (response.body.didDocument) {
            // Assert that response body contains 'didDocument' property
            expect(response.body).to.have.property("didDocument");
            expect(response.body.didDocument).to.have.property("id").and.to.eq(did);
          } else {
            // If 'didDocument' is not found, log it for debugging
            cy.log("Error: didDocument not found in the response.");
          }
        });
    });

    it("should return 404 for an invalid DID", () => {
        cy.request({
          method: "GET",
          url: `/did/resolve-did-doc?did=${invalidDid}`, // Using the invalid DID
          failOnStatusCode: false, // Do not fail the test for non-200 status codes
        }).then((response) => {
          // Log the entire response body for debugging
          cy.log("Invalid DID Response Body:", JSON.stringify(response.body));
    
          // Assert status code is 404 (Not Found)
          expect(response.status).to.eq(404);
    
          // Check if the response body contains the error message
          expect(response.body).to.eq("Identity not found");  // Assert the string directly
        });
    });
// GET Alias
it("should return the correct response for checking alias with display_name", () => {
    const displayName = 'ashwin'; // Display name parameter for the query
  
    cy.request({
        method: "GET",
        url: `/resolver/check-alias?display_name=${displayName}`,
      }).then((response) => {
        cy.log("Full Response:", JSON.stringify(response.body)); // Log entire response body
      
        expect(response.status).to.eq(200); // Ensure expected status code
      
        // Check the structure of the response body to find the correct property
      });
    });      
//invalidcase for get alias


    it("should return appropriate response for invalid alias", () => {
        const invalidDisplayName = "invalid_alias"; // Make sure this is truly invalid
      
        cy.request({
          method: "GET",
          url: `/resolver/check-alias?display_name=${invalidDisplayName}`,
          failOnStatusCode: false, // Prevent Cypress from failing the test on non-2xx
        }).then((response) => {
          cy.log("Invalid Alias Response Body:", JSON.stringify(response.body));
          cy.log("Status Code:", response.status);
      
          // Check status code (you can adjust if your API always returns 200)
          expect(response.status).to.eq(200); // Or use 404 if that's expected
      
          // Now assert based on actual API structure
          if (response.body.found === false) {
            expect(response.body).to.have.property("found").and.to.eq(false);
          } else {
            // Unexpected: API says alias is found when it shouldn't be
            throw new Error("Expected alias to not be found, but got found=true");
          }
        });
      });
      
});
