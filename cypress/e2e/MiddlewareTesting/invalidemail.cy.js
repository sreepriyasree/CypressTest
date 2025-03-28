describe("User Authentication Flow", () => {
  it("should test various email formats during user creation", () => {
    const generateUser = (email) => {
      const timestamp = Date.now();
      return {
        username: `user${timestamp}`,
        email: email || `testuser+${timestamp}@dhiway.com`
      };
    };

    // ✅ Positive Test: Valid Email
    let validUser = generateUser();
    cy.log("Testing with valid email:", validUser.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "password1234",
        username: validUser.username,
        firstname: "Test",
        lastname: "User",
        email: validUser.email,
        email_verified: true
      }
    }).its("status").should("equal", 200);

    // ❌ Negative Test: Email with spaces (invalid case)
    let invalidUser1 = generateUser("invalid email@dhiway.com");
    cy.log("Testing with spaces in email:", invalidUser1.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "password1234",
        username: invalidUser1.username,
        firstname: "Test",
        lastname: "User",
        email: invalidUser1.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).its("status").should("not.equal", 200);

    // ❌ Negative Test: Email missing '@' symbol
    let invalidUser2 = generateUser("invalidemail.com");
    cy.log("Testing missing '@' in email:", invalidUser2.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "password1234",
        username: invalidUser2.username,
        firstname: "Test",
        lastname: "User",
        email: invalidUser2.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).its("status").should("not.equal", 200);

    // ❌ Negative Test: Email with special characters in domain (invalid)
    let invalidUser3 = generateUser("testuser@dhiway@com");
    cy.log("Testing invalid domain:", invalidUser3.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "password1234",
        username: invalidUser3.username,
        firstname: "Test",
        lastname: "User",
        email: invalidUser3.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).its("status").should("not.equal", 200);

    // ❌ Negative Test: Email with forbidden characters
    let invalidUser4 = generateUser("tertstcgc37839393y#!!!!!!8978@ddgd.com");
    cy.log("Testing with forbidden characters:", invalidUser4.email);
    cy.request({
      method: "POST",
      url: "/auth/user",
      body: {
        password: "password1234",
        username: invalidUser4.username,
        firstname: "Test",
        lastname: "User",
        email: invalidUser4.email,
        email_verified: true
      },
      failOnStatusCode: false
    }).its("status").should("not.equal", 200);
  });
});
