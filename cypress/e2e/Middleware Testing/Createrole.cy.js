describe("User Authentication Flow", () => {
    it("should create a user, get a token, and update the role", () => {
        const timestamp = Date.now();
        const rolename = `usertest-${timestamp}`;
        let roleId; // Variable to store role ID
        const updaterolename = `testrolename-${timestamp}`;

        // Step 1: Get Authentication Token
        cy.request({
            method: "POST",
            url: "http://localhost:5001/v1/auth/token",
            body: {
                username: "sreepriya@dhiway.com",
                password: "sreetest",
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            const accessToken = response.body.access_token;
            cy.log("Access Token:", accessToken);

            // Step 2: Create Role
            cy.request({
                method: "POST",
                url: "http://localhost:5001/v1/auth/roles",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: {
                    name: rolename,
                },
            }).then((roleResponse) => {
                expect(roleResponse.status).to.equal(200);

                // Step 3: Get Role List and Find Created Role
                cy.request({
                    method: "GET",
                    url: `http://localhost:5001/v1/auth/roles`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }).then((rolesResponse) => {
                    expect(rolesResponse.status).to.equal(200);
                    const createdRole = rolesResponse.body.find(role => role.name === rolename);
                    
                    if (!createdRole) {
                        throw new Error(`Role "${rolename}" not found in response`);
                    }

                    roleId = createdRole.id; // Store the correct role ID
                    cy.log("Role Created with ID:", roleId);
                    cy.log("Role is",rolename);

                    // Step 4: Update Role (Fix URL)
                    cy.request({
                        method: "PUT",
                        url: `http://localhost:5001/v1/auth/roles`, 
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: {
                            role_id: roleId, // Required in body if API expects it
                            name: updaterolename, // Updated role name
                        },
                    }).then((updateResponse) => {
                        expect(updateResponse.status).to.equal(200);
                        cy.log("Role Updated Successfully");
                        cy.log("Updated role",updaterolename)
                     
                    });
       // GET Role
                    cy.request({
                        method: "GET",
                        url: `http://localhost:5001/v1/auth/roles?role=${updaterolename}`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }).then((rolesResponse) => {
                        expect(rolesResponse.status).to.equal(200);
                        
                    })  
    
                });
            });
        });
    });
});
