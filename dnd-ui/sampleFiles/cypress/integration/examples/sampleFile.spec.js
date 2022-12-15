/// <reference types="cypress" />

context('Querying', () => {
	it('Register', () => {
		cy.visit('https://auth.planetscale.com/sign-up')
		cy.get('#user_email').type('hungdh131@gmail.com')
		cy.get('#user_password').type('th1515D@PassW0rd')
		cy.get('#user_password_confirmation').type('th1515D@PassW0rd')
		cy.get('#tos').click()
		cy.contains("Sign up")

	})
})
