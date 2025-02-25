import { describe } from "mocha";

describe("HTTP Requests",() => {
  /*it ("post call",()=>{
    // Create user
    cy.request({
        method: 'POST',
        url : 'http://localhost:5001/v1/auth/user',
       body: {
        "email": "sreepriya+1111@dhiway.com",
        "email_verified": false,
        "firstname": "Shreyasree",
        "lastname": "S",
        "password": "password1234",
        "realm_roles": [
          "admin"
        ],
        "username": "shreyas123"
      }
    })
    .its('status')
    .should('equal',200);
  })


  
    it ("Post call",() =>{
        // authorise 

        cy.request( {
            method:'POST',

            url: 'http://localhost:5001/v1/auth/user',

            body:{
                "password": "password1234",
      "username": "shreyas123",
    "firstname":"Shreyasree",
    "lastname":"S",
    "email": "sreepriya+1111@dhiway.com",
 
    
      "realm_roles": ["offline_access"]
      ,"email_verified":true

    
        } 
        })
        .its('status')
        .should('equal',200);
    }) */
// create token
    it("Postcall",()=>{

        cy.request( {
        method:'POST',

        url: 'http://localhost:5001/v1/auth/token',

        body:
        {

            "username":"shreyas123",
            "password":"shreya1234"
    
        }
     })
    .its('status')
    .should('equal',200)
    })

    it("Postcall",()=>{
// authorise token
        cy.request( {
        method:'POST',

        url: 'http://localhost:5001/v1/auth/token',

        body:
        {

            "username":"shreyas",
            "password":"password1234"
    
        }
     })
    .its('status')
    .should('equal',200)
    })
    



    it ("Post call",() =>{
        // verify email

        cy.request( {
            method:'POST',

            url: 'http://localhost:5001/v1/auth/verify-email',

            body:
            {
                "user_id": "61630ca8-0684-4ce0-805c-c8339d14d909"
              }
         })
        .its('status')
        .should('equal',200);

    })


})