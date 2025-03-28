describe("Invalid User Authentication and Role Management Scenarios", () => {
    it("should handle invalid cases for user authentication and role management", () => {
        const invalidUserId = "non_existent_user_id";
        const invalidRoleId = "non_existent_role_id";
        const invalidAccessToken = "invalid_access_token";
        const invalidRefreshToken = "invalid_refresh_token";

        // 🚨 1. Create User Without Required Fields
        cy.request({
            method: "POST",
            url: "/auth/user",
            body: {
                username: "invaliduser",
                email: "invalidemail@dhiway.com"
                // Missing password
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
            cy.log("✅ User creation failed as expected:", response.body.error);
        });

        // 🚨 2. Log in with an Invalid Password
        cy.request({
            method: "POST",
            url: "/auth/token",
            body: {
                username: "sreetest",
                password: "wrongpassword"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Login failed with wrong password:", response.body.error);
        });

        // 🚨 3. Refresh Token with Invalid Token
        cy.request({
            method: "POST",
            url: "/auth/refresh/token",
            body: { refresh_token: invalidRefreshToken },
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            cy.log("✅ Token refresh failed:", response.body.error);
        });
// VERIFY TOKEN - Invalid Case
cy.request({
    method: "GET",
    url: "/auth/verify/token",
    headers: {
        Authorization: `Bearer ${invalidAccessToken}` // ❌ Using an invalid token
    },
    failOnStatusCode: false // Prevents Cypress from failing automatically
}).then((tokenResponse) => {
    expect(tokenResponse.status).to.equal(200); // Expect failure
    cy.log("Invalid Token Response:", JSON.stringify(tokenResponse.body, null, 2));


        // 🚨 4. Create Role Without Authorization
        cy.request({
            method: "POST",
            url: "/auth/roles",
            body: { name: "unauthorized-role" },
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Role creation failed without authorization:", response.body.error);
        });

        // 🚨 5. Get User Details with Invalid User ID
        cy.request({
            method: "GET",
            url: `/auth/user?user_id=${invalidUserId}`,
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Fetching non-existent user failed:", response.body.error);
        });

        // 🚨 6. Update a Non-Existent Role
        cy.request({
            method: "PUT",
            url: `/auth/roles`,
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            body: { role_id: invalidRoleId, name: "updated-role" },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Updating non-existent role failed:", response.body.error);
        });

        // 🚨 7. Assign Role to Non-Existent User
        cy.request({
            method: "POST",
            url: `/auth/user/role-mappings`,
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            body: {
                realm_roles: [{ id: "valid_role_id", name: "Admin" }],
                user_id: invalidUserId
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Assigning role to non-existent user failed:", response.body.error);
        });

        // 🚨 8. Delete Role Mapping That Doesn't Exist
        cy.request({
            method: "DELETE",
            url: `auth/user/role-mappings`,
            headers: { Authorization: `Bearer ${invalidAccessToken}` },
            body: {
                realm_roles: [{ id: "valid_role_id", name: "Admin" }],
                user_id: invalidUserId
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(401);
            cy.log("✅ Deleting non-existent role mapping failed:", response.body.error);
        });
    });
});
});