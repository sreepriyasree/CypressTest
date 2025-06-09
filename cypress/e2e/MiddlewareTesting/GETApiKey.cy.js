describe("GET API Key Test", () => {
  let accessToken = "";

  before(() => {
    // Get Access Token (adjust this based on your auth flow)
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
      cy.log("Access Token:", accessToken);
    });
  });

  it("should fetch the API key", () => {
    cy.request({
      method: "GET",
      url: "/auth/api-key",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      cy.log("API Key GET Response:", JSON.stringify(response.body, null, 2));

      // Expect 200 OK or handle other expected responses
      expect(response.status).to.eq(200);

      // Validate the API key presence (adjust key name as per actual response)
     // expect(response.body).to.have.property("apiKey").and.to.not.be.empty;
    });
  });
});
