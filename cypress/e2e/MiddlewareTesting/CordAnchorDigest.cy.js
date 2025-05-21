describe("POST Anchor Digest API Test", () => {
  let accessToken = "";
  let dynamicDigest = "";
  const invalidDigest = "";

  before(() => {
    // Step 1: Get Access Token
    cy.request({
      method: "POST",
      url: "/auth/token",
      body: {
        username: "sreetest",
        password: "sree@dhiway",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      accessToken = response.body.access_token;
    });
  });

  beforeEach(() => {
    // Step 2: Generate dynamic digest (Example: using SHA256 of some string)
    const input = `Test string ${Date.now()}`;
    cy.task("generateDigest", input).then((digest) => {
      dynamicDigest = digest;
      cy.log("Generated Digest:", dynamicDigest);
    });
  });
it("should post a digest and then fetch anchor status for the same digest", () => {
  // Step 1: POST the dynamic digest
  cy.request({
    method: "POST",
    url: "/cord/anchor-digest",
    body: {
      digest: dynamicDigest,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    failOnStatusCode: false,
  }).then((postResponse) => {
    cy.log("Valid Digest POST Response:", JSON.stringify(postResponse.body));
    expect(postResponse.status).to.eq(200);

    // Step 2: Use the same digest to fetch status
   
       // Wait for a few seconds before checking status
    cy.wait(20000); // wait for 5 seconds (adjust if needed)

    // Step 2: Use the same digest to fetch status
    cy.log("Checking status for digest: ", dynamicDigest);
    cy.request({
      method: "GET",
      url: `/cord/anchor-digest/status?digest=${dynamicDigest}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      failOnStatusCode: false,
    }).then((getResponse) => {
      cy.log("Anchor Status GET Response:", JSON.stringify(getResponse.body));
      expect(getResponse.status).to.eq(200); // adjust if necessary
    });

    cy.request({
        method: "GET",
        url: `/cord/anchor-digest/status?digest=${dynamicDigest}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        failOnStatusCode: false,
      }).then((getResponse) => {
        cy.log("Anchor Status GET Response:", JSON.stringify(getResponse.body));
        expect(getResponse.status).to.eq(200);

        // Step 6: Generate new digest and update
        const newInput = `dynamicDigest ${Date.now()}`;
        cy.task("generateDigest", newInput).then((newDigest) => {
          cy.log("New Digest to update:", newDigest);

          cy.request({
            method: "POST",
            url: "/cord/update-digest",
            body: {
              old_digest: dynamicDigest,
              new_digest: newInput,
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            failOnStatusCode: false,
          }).then((updateResponse) => {
            cy.log("Update Digest Response:", JSON.stringify(updateResponse.body));
            expect(updateResponse.status).to.eq(200); // adjust as per your API spec
          });
        });
      });
  });
});
 /* it("should return expected response for a valid digest", () => {
    cy.request({
      method: "POST",
      url: "/cord/anchor-digest",
      body: {
        digest: dynamicDigest,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log("Valid Digest POST Response:", JSON.stringify(response.body));
      
      expect(response.status).to.eq(200);
    });
  });*/

 /* it("should return an error for an empty digest", () => {
    cy.request({
      method: "POST",
      url: "/cord/anchor-digest",
      body: {
        digest: invalidDigest,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log("Invalid Digest POST Response:", JSON.stringify(response.body));
      expect(response.status).to.eq(400);
     // expect(response.body).to.have.any.keys("error", "message", "status");
    });
  });*/
 /*  it("should fetch anchor status using provided digest", () => {
  const providedDigest = "0xa8301d826d93c871cb3d31eb275169932c56c15863afbf316083120194a02a54";
cy.log('digest for get ',dynamicDigest)
  cy.request({
    method: "GET",
    url: `/cord/anchor-digest/status?digest=${providedDigest}`,
  
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    failOnStatusCode: false,
  }).then((response) => {
    cy.log("Anchor Status GET Response:", JSON.stringify(response.body));
    expect(response.status).to.eq(200);// adjust based on expected behavior
  });*/
});

