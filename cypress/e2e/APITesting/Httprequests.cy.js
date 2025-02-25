import { describe } from "mocha";

describe("HTTP Requests",() => {
  
    it ("Get call",() =>{

        cy.request('Get','https://jsonplaceholder.typicode.com/posts/1')
        .its('status').should('equal', 200);
    })
    it ("Post call",() =>{

        cy.request({
            method:'POST',

            url:'https://jsonplaceholder.typicode.com/posts',
            body:{
                title: "Test Post",
                body:"This is a post call",
            userId:1
        } 
        })
        .its('status')
        .should('equal',201);
    })
    })
