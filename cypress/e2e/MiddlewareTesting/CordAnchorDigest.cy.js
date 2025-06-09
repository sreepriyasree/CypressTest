describe("POST Anchor Digest API Test", () => {
  let accessToken = "";
  let dynamicDigest = "";

  const waitForAnchorStatus = (digest, token, retries = 10, delay = 5000) => {
    return new Cypress.Promise((resolve, reject) => {
      cy.wait(20000);
      const poll = (attempt = 0) => {
        cy.request({
          method: "GET",
          url: `/cord/anchor-digest/status?digest=${digest}`,
          headers: { Authorization: `Bearer ${token}` },
          failOnStatusCode: false,
          
        }).then((res) => {
           
          cy.log(`Polling Attempt ${attempt + 1}:`, res.body.status);
          if (res.body.status === "anchored") {
            resolve();
          } else if (attempt < retries - 1) {
            setTimeout(() => poll(attempt + 1), delay);
          } else {
            reject("Digest did not reach 'anchored' status in time");
          }
        });
      };
      poll();
    });
  };

  before(() => {
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
    const input = `Test string ${Date.now()}`;
    cy.task("generateDigest", input).then((digest) => {
      dynamicDigest = digest;
      cy.log("Generated Digest:", dynamicDigest);
    });
  });

  it("should post a digest, wait for anchoring, and then update it", () => {
    // Step 1: POST the dynamic digest
    cy.request({
      method: "POST",
      url: "/cord/anchor-digest",
      body: { digest: dynamicDigest },
      headers: { Authorization: `Bearer ${accessToken}` },
      failOnStatusCode: false,
    }).then((postResponse) => {
      cy.log("POST Digest Response:", JSON.stringify(postResponse.body));
      expect(postResponse.status).to.eq(200);

      // Step 2: Poll for digest to be anchored
      waitForAnchorStatus(dynamicDigest, accessToken)
        .then(() => {
          // Step 3: Generate a new digest to update with
          const newInput = `Updated string ${Date.now()}`;
          cy.task("generateDigest", newInput).then((newDigest) => {
            cy.log("New Digest to update:", newDigest);

            // Step 4: POST to update-digest
            cy.request({
              method: "POST",
              url: "/cord/update-digest",
              body: {
                old_digest: dynamicDigest,
                new_digest: newDigest,
              },
              headers: { Authorization: `Bearer ${accessToken}` },
              failOnStatusCode: false,
            }).then((updateResponse) => {
              cy.log("Update Digest Response:", JSON.stringify(updateResponse.body));
              expect(updateResponse.status).to.eq(200);
            });
          });
        })
        .catch((err) => {
          throw new Error(`Anchoring failed: ${err}`);
        });
    });
  });
});
