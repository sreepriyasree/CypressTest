


describe('cssLocators',()=>{
 it("csslocator",() =>{
    cy.visit("https://testautomationpractice.blogspot.com/")
    cy.get('#Wikipedia1_wikipedia-search-input').type("T-shirts")
cy.get('.wikipedia-search-button').click()
cy.get('#Wikipedia1_wikipedia-search-results > :nth-child(1) > a').contains('T-shirt')
 cy.xpath("//input[@id='name']").type("Test")


 })   
})