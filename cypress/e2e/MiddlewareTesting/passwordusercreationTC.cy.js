describe("User Authentication Flow", () => {
  it("should test various password edge cases", () => {
    const generateUser = () => {
      const timestamp = Date.now();
      return {
        username: `user${timestamp}`,
        email: `testuser+${timestamp}@dhiway.com`
      };
    };

    // ✅ Test 1: Password with special characters
    let user1 = generateUser();
    cy.log("Testing User:", user1.username, "Email:", user1.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "@#!#$$$$#$##",
        username: user1.username,
        firstname: "Test",
        lastname: "User",
        email: user1.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log("✅ Password with special characters worked");
     
      expect(response.status).to.eq(200);
    });

    // ✅ Test 2: Password with Alphanumeric
    let user2 = generateUser();
    cy.log("Testing User:", user2.username, "Email:", user2.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "ABC123de456",
        username: user2.username,
        firstname: "Test",
        lastname: "User",
        email: user2.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).then((response) => {
      
      cy.log("✅ Password Alphanumeric should pass");
      expect(response.status).to.eq(200);
    });

    // ✅ Test 3: Password with only spaces (invalid case)
    let user3 = generateUser();
    cy.log("Testing User:", user3.username, "Email:", user3.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        email: user3.email,
        password: "           ",
        username: user3.username,
        email_verified: true,
        firstname: "Test",
        lastname: "User",
        realm_roles: [{ id: "string", name: "string" }]
      },
      failOnStatusCode: false
    }).then((response) => {
     // cy.log("Response code =" ,response.status);
     
      cy.log("❌ Password with only spaces should fail");
      expect(response.status).to.not.eq(200);
    });

    // ✅ Test 4: Password with less than 8 characters (invalid case)
    let user4 = generateUser();
    cy.log("Testing User:", user4.username, "Email:", user4.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "abc", // Too short
        username: user4.username,
        firstname: "Test",
        lastname: "User",
        email: user4.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.log("❌ Password less than 8 characters should fail");
      expect(response.status).to.not.eq(200);
    });
  });
});
