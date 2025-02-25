describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://google.com')
    
    cy.get(':nth-child(2) > .gb_W').click()
    cy.get('#APjFqb').type('testing{enter}')
    
    
    cy.get('[data-hveid="CBEQAA"] > .nPDzT > .YmvwI',{timeout: 5000}).click()


   

    cy.get('[data-hveid="CA4QAA"] > .LatpMc > .YmvwI',{timeout:6000}).click()


    cy.get('[href="/search?q=testing&sca_esv=68f5f289e15608b2&hl=en&biw=1000&bih=660&udm=36&source=lnms&fbs=AEQNm0Aa4sjWe7Rqy32pFwRj0UkWd8nbOJfsBGGB5IQQO6L3JwUYUUKVYfCUz3e6iewtpOaheeX3A2tLojMI1UZQVAM3lVVAvs4XdCXXJNdW2oIjWrb98i03T7g4fIPteO50mrazcHbK3DK9sI_awbAt91d7Kf9g-NcO1rYvsH3RcojhEZZhzyaCnIk0odcV8kE0meCWoSUDkCY9SYOoZD1iVHWdvd_Elw&sa=X&ved=2ahUKEwj3p6e92oaLAxU0oGMGHSF_HQkQ0pQJegQIBhAH"] > .YmvwI').click()
  })
})