describe("User Authentication Flow", () => {
    it("should create a user, get a token, refresh the token, and reset the password", () => {
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
                email_verified: true
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            const userId = response.body.id;
            cy.log("User ID:", userId);

            // Step 2: Get Access Token
            cy.request({
                method: "POST",
                url: "/auth/token",
                body: {
                    username: username,
                    password: "password1234"
                }
            }).then((tokenResponse) => {
                expect(tokenResponse.status).to.equal(200);
                const accessToken = tokenResponse.body.access_token;
                const refreshToken = tokenResponse.body.refresh_token;

                cy.log("Access Token:", accessToken);
                cy.log("Refresh Token:", refreshToken);

                // Step 3: Refresh Token
                cy.request({
                    method: "POST",
                    url: "/auth/refresh/token",
                    body: {
                        refresh_token: refreshToken
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).its("status").should("equal", 200);

                // Step 4: Reset Password (Fixed with Authorization Header)
                cy.request({
                    method: "POST",
                    url: "/auth/reset-password",
                    body: {
                        new_password: "sreepassword123",
                        user_id: userId,
                        via_email: false
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).its("status").should("equal", 200);
                //step 5 : Get user

                cy.request({
                    method: "GET",
                    url: "/auth/user",
                    body: {
                       
                        user_id: userId,
                       
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((response) => {

                    cy.log("User List Response Body:", response.body);
                    expect(response.status).to.eq(200);
                });
 // Step 6: Verify email
 cy.request({
    method: "POST",
    url: "/auth/verify-email",
    body: {
       
        user_id: userId,
       
    },
    headers: {
        Authorization: `Bearer ${accessToken}`
    }       
        }).then((response) => {

    cy.log("Verify email:", response.body);
    expect(response.status).to.eq(200);

                })
//step 7: Update user
                cy.request({
                    method:"PUT",
                    url: "/auth/user",
                    body:{
                        user_id: userId,
                        username:`usertest-${timestamp}`

                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }       
                        }).then((response) => {
                
                    cy.log("Updated user:", response.body);
                    expect(response.status).to.eq(200);
                    cy.log("User",username);

                })
            });
        });
    });
})
