///<reference types="cypress"/>

it('studiodemotest',function(){
    cy.visit('https://studiodemo.dhiway.com')
    cy.get('#email').type('sreepriya+test@dhiway.com{enter}')

    cy.get(':nth-child(5) > .col-12')
    cy.get(':nth-child(1) > .form-control').type('913345{enter}')
    cy.get('.btn-inner--text').click()
  
   
    cy.get(':nth-child(3) > [style="cursor: pointer; background: 0% 0% no-repeat padding-box padding-box rgb(255, 255, 255); box-shadow: rgba(64, 23, 47, 0.16) 0px 3px 6px; border-radius: 10px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; width: 100%; max-width: 596px;"]').click()
    
    cy.wait(4000)
    cy.xpath('//*[@id="space-template-cards"]/div[1]')
    .should('exist') // Assert that the element exists
    .click();
   // cy.get('#space-template-cards > .font-family-regular').click()
    //cy.get('#space-template-cards').click()
    cy.get('.submit-design').click()
    cy.get('#add-button').click()
    cy.wait(4000)
    
    cy.contains('Background').click()
   
  cy.get('#center-bg-con').click()
    cy.contains('Recent Backgrounds').click()
 
    cy.get('.m-0 > img').click()
    cy.get('#add-button').click()
    cy.wait(4000)
    cy.contains('Name')
    cy.get('.back-button-header').click()
    cy.get('.input').type('testing design1')
    cy.get('.save').click()


})
