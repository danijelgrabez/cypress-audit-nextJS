/// <reference types="cypress" />

context('Accessibility and Performance Testing', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('audits the home page', () => {
    // Note: Bare config
    cy.lighthouse({
      accessibility: 40,
      'best-practices': 50,
      seo: 50,
      pwa: 20,
      performance: 49,
    });
  });
  });

  it('pa11y', () => {
    cy.pa11y({
      headers: {
        title: true,
      },
    });
  });
});
