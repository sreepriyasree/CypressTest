describe("User Authentication Flow", () => {
    it("should get a token, refresh and verify", () => {
        const timestamp = Date.now();
        const username = `user${timestamp}`;
        const email = `testuser+${timestamp}@dhiway.com`;
        const rolename = `verifier-${timestamp}`;
        const updaterolename = `testrolename-${timestamp}`;
        const UserID = "67b64773-160a-4cea-9d95-9d3071a0efb2";
        let roleId;

        // Step 1: Create User
        cy.request({
            method: "POST",
            url: "/auth/user", // ✅ Uses baseUrl
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
                url: "/auth/token", // ✅ Uses baseUrl
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
                    url: "/auth/refresh/token", // ✅ Uses baseUrl
                    body: {
                        refresh_token: refreshToken
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((tokenResponse) => {
                    expect(tokenResponse.status).to.equal(200);

                    // VERIFY TOKEN
                    cy.request({
                        method: "GET",
                        url: "/auth/verify/token", // ✅ Uses baseUrl
                       
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }).then((tokenResponse) => {
                        expect(tokenResponse.status).to.equal(200);
                        cy.log("Verified Token:", tokenResponse);
                        cy.log("Verified Token:", JSON.stringify(tokenResponse.body, null, 2));
                        

                // Step 4: Reset Password
                cy.request({
                    method: "POST",
                    url: "/auth/reset-password", // ✅ Uses baseUrl
                    body: {
                        new_password: "sreepassword123",
                        user_id: userId,
                        via_email: false
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).its("status").should("equal", 200);

                // Step 5: Get User
                cy.request({
                    method: "GET",
                    url: "/auth/user", // ✅ Uses baseUrl
                    body: { user_id: userId },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then((response) => {
                    cy.log("User List Response Body:", response.body);
                    expect(response.status).to.eq(200);
                });

                // Step 6: Verify Email
                cy.request({
                    method: "POST",
                    url: "/auth/verify-email", // ✅ Uses baseUrl
                    body: { user_id: userId },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then((response) => {
                    cy.log("Verify email:", response.body);
                    expect(response.status).to.eq(200);
                });

                // Step 7: Update User
                cy.request({
                    method: "PUT",
                    url: "/auth/user", // ✅ Uses baseUrl
                    body: { user_id: userId, username: `usertest-${timestamp}` },
                    headers: { Authorization: `Bearer ${accessToken}` }
                }).then((response) => {
                    cy.log("Updated user:", response.body);
                    expect(response.status).to.eq(200);
                });

                // Step 8: Get Auth Token for Role Management
                cy.request({
                    method: "POST",
                    url: "/auth/token", // ✅ Uses baseUrl
                    body: {
                        username: "sreetest",
                        password: "sreepassword"
                    }
                }).then((response) => {
                    expect(response.status).to.equal(200);
                    const roleAccessToken = response.body.access_token;
                    cy.log("Role Management Access Token:", roleAccessToken);

                    // Step 9: Create Role
                    cy.request({
                        method: "POST",
                        url: "/auth/roles", // ✅ Uses baseUrl
                        headers: {
                            Authorization: `Bearer ${roleAccessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: { name: rolename }
                    }).then((roleResponse) => {
                        expect(roleResponse.status).to.equal(200);

                        // Step 10: Get Role List and Find Created Role
                        cy.request({
                            method: "GET",
                            url: "/auth/roles", // ✅ Uses baseUrl
                            headers: {
                                Authorization: `Bearer ${roleAccessToken}`,
                                "Content-Type": "application/json"
                            }
                        }).then((rolesResponse) => {
                            expect(rolesResponse.status).to.equal(200);
                            const createdRole = rolesResponse.body.find(role => role.name === rolename);
                            
                            if (!createdRole) {
                                throw new Error(`Role "${rolename}" not found in response`);
                            }

                            roleId = createdRole.id;
                            cy.log("Role Created with ID:", roleId);

                            // Step 11: Update Role
                            cy.request({
                                method: "PUT",
                                url: "/auth/roles", // ✅ Uses baseUrl
                                headers: {
                                    Authorization: `Bearer ${roleAccessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: { role_id: roleId, name: updaterolename }
                            }).then((updateResponse) => {
                                expect(updateResponse.status).to.equal(200);
                                cy.log("Role Updated Successfully");
                            });

                            // Step 12: Get Role
                            cy.request({
                                method: "GET",
                                url: `/auth/roles?role=${updaterolename}`, // ✅ Uses baseUrl
                                headers: {
                                    Authorization: `Bearer ${roleAccessToken}`,
                                    "Content-Type": "application/json"
                                }
                            }).then((rolesResponse) => {
                                expect(rolesResponse.status).to.equal(200);
                                cy.log("Role ID:", roleId);
                            });

                            // Step 13: Add Role Mapping
                            cy.request({
                                method: "POST",
                                url: "/auth/user/role-mappings", // ✅ Uses baseUrl
                                headers: {
                                    Authorization: `Bearer ${roleAccessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: {
                                    "realm_roles": [
                                        { "id": "9d8463e4-6860-49d5-b211-5208f55b40a7", "name": "Admin" }
                                    ],
                                    "user_id": UserID
                                }
                            }).then((updateResponse) => {
                                expect(updateResponse.status).to.equal(200);
                                cy.log("Role Mapping Added Successfully");
                            });

                            // Step 14: Delete Role Mapping
                            cy.request({
                                method: "DELETE",
                                url: "/auth/user/role-mappings", // ✅ Uses baseUrl
                                headers: {
                                    Authorization: `Bearer ${roleAccessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: {
                                    "realm_roles": [
                                        { "id": "9d8463e4-6860-49d5-b211-5208f55b40a7", "name": "Admin" }
                                    ],
                                    "user_id": UserID
                                }
                            }).then((response) => {
                                expect(response.status).to.equal(200);
                                cy.log("Role Mapping Deleted Successfully");
                            });
                        });
                    });
                });
            });
        });
    });
});
});
})