describe("User Authentication Flow", () => {
    it("should create a user, get a token, and refresh the token", () => {
      // Generating dynamic username and email 
      const timestamp = Date.now();
      const username = `user${timestamp}`;
      const email = `testuser222wewewe32d3edds33wed33d34@#$$$ER##$34frvcx+${timestamp}@dhiway.com`;
  
      cy.log("Generated Username:", username);
      cy.log("Generated Email:", email);
  
      // Step 1: Create User
      cy.request({
        method: "POST",
        url: "http://localhost:5001/v1/auth/user",
        body: {
          password: "password1234",
          username: username,
          firstname: "Test",
          lastname: "User",
          email: email,
         // realm_roles: ["offline_access"],
          email_verified: true
        }
      })
        .its("status")
        .should("equal", 200);
    })
  })

