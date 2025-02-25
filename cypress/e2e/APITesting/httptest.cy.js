import { describe } from "mocha";
var username ="sreepriyasree";
var email = "sreepriya+12@dhiway.com"
describe("HTTP Requests",() => {
  
  
    it ("Post call",() =>{

        cy.request( {
            method:'POST',

            url: 'http://localhost:5001/v1/auth/user',

            body:{
                "password": "abcd1234",
    "username": username,
    "firstname":"SreepriyaSree",
    "lastname":"Sreekumar",
    "email": email
    
      ,//"realm_roles": ["offline_access"]
      ,"email_verified":true

    
        } 
        })
        .its('status')
        .should('equal',200);
    }) 

  
  /*  it ("Post call",() =>{

        cy.request( {
            method:'POST',

            url: 'http://localhost:5001/v1/auth/verify-email',

            body:{
                "user_id": "b1c8eb0a-9e06-4919-93d9-5dc6bcab1bb0"
              }
            })
            .its('status')
            .should('equal',200)
        
    }) */
            it ("Post call",() =>{

                cy.request( {
                    method:'POST',
        
                    url: 'http://localhost:5001/v1/auth/reset-password',
                    headers: {
                        Authorization: `Bearer YOUR_ACCESS_TOKEN`,  // Replace with actual token
                        'Content-Type': 'application/json'
                    },
                    body:{
                        "new_password": "testpassword123",
                        "user_id": "b1c8eb0a-9e06-4919-93d9-5dc6bcab1bb0"
                      }
                    })
                    .its('status')
                    .should('equal',200)
                
            })



})