describe("User Authentication Flow", () => {
    it("should create a user, get a token, and update the role", () => {
        const timestamp = Date.now();
        const rolename = `usertest-${timestamp}`;
        const UserID = "67b64773-160a-4cea-9d95-9d3071a0efb2";
        let roleId; // Variable to store role ID
        const updaterolename = `testrolename-${timestamp}`;

        // Step 1: Get Authentication Token
        cy.request({
            method: "POST",
            url: "/auth/token",
            body: {
                username: "sreetest",
                password: "sreepassword",
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            const accessToken = response.body.access_token;
            cy.log("Access Token:", accessToken);

            // Step 2: Create Role
            cy.request({
                method: "POST",
                url: "/auth/roles",
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
                    url: `/auth/roles`,
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
                        url: `/auth/roles`, 
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
                        url: `/auth/roles?role=${updaterolename}`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }).then((rolesResponse) => {
                        expect(rolesResponse.status).to.equal(200);
                        cy.log("Role id",roleId)
                        
                    }) ;
                    cy.log("User ID:", UserID);

                    //ADD Role mapping 
                    cy.request({
                        method: "POST", // Changed from PUT to POST
                        url: `/auth/user/role-mappings`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: {
                            "realm_roles": [
                                { "id": "9d8463e4-6860-49d5-b211-5208f55b40a7", "name": "Admin" }
                            ],
                            "user_id": UserID,
                        }
                    }).then((updateResponse) => {
                        expect(updateResponse.status).to.equal(200);
                        cy.log("Role Mapping Added Successfully");
                    });
                    //Delete RoleMapping
                    cy.request({
                        method: "DELETE",
                        url: `/auth/user/role-mappings`,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: {
                            "realm_roles": [
                                {
                                    "id": "9d8463e4-6860-49d5-b211-5208f55b40a7",
                                    "name": "Admin"
                                }
                            ],
                            "user_id": UserID
                        }
                    }).then((response) => {
                        expect(response.status).to.equal(200); // Ensure successful deletion
                        cy.log("Role Mapping Deleted Successfully");
                    });
                    
                    
                  
    
                });
            });
        });
    });
});
