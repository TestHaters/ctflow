
		/// <reference types="cypress" />

		context('Generated By Ctflow', () => {
			it('Demo CtFlow', () => {
				
      cy.visit('https://ampo.vn')
    

      cy.get('[data-test=search-bar]').click()
    

      cy.wait(500)
    

    cy.get('[data-test=search-bar]').type('Den led nanoco')
    

      cy.get('body').contains("NLF1506")
    

			})
		})
		