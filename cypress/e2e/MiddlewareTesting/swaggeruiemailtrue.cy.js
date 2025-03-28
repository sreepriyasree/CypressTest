describe("User Authentication Flow", () => {
    it("should create a user, get a token, and refresh the token", () => {
      // Generating dynamic username and email 
      const timestamp = Date.now();
      const username = `user${timestamp}`;
      const email = `testuser+${timestamp}@dhiway.com`;
  
      cy.log("Generated Username:", username);
      cy.log("Generated Email:", email);
  
      // Step 1: Create User
      cy.request({
        method: "POST",
        url: "/auth/user",
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
       
       
      // Step 2: Get Access Token
      cy.request({
        method: "POST",
        url: "/auth/token",
        body: {
          username: username,
          password: "password1234"
        }
      }).then((response) => {
        expect(response.status).to.equal(200);
        const accessToken = response.body.access_token;
        const refreshToken = response.body.refresh_token;
  
        cy.log("Access Token:", accessToken);
        cy.log("Refresh Token:", refreshToken);
  
        // Step 3: Refresh Token
        cy.request({
          method: "POST",
          url: "/auth/refresh/token",
          body: {
            refresh_token: refreshToken
          }
        })
          .its("status")
          .should("equal", 200);
      });
    });
  });