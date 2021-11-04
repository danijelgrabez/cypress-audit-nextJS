/// <reference types="cypress" />

context('Accessibility and Performance Testing', () => {
  it.skip('audits the home page', () => {
    cy.visit('/');

    cy.lighthouse({
      accessibility: 40,
      'best-practices': 50,
      seo: 50,
      pwa: 20,
      performance: 49,
    });

    // NOTE: Available options
    // https://github.com/mfrachet/cypress-audit/blob/5971d705670147b9dabb2ab0c8981a734d25b29d/index.d.ts#L6
    cy.pa11y({
      headers: {
        title: true,
      },
      ignore: ['html-has-lang'],
    });
  });

  // NOTE: Custom thresholds
  // Read more about recommended config for better results:
  // https://github.com/mfrachet/cypress-audit/blob/master/docs/lighthouse.md#lighthouse-scores-may-be-different-between-local-run-and-cypress-audit
  it.only('audits the homepage with custom threshold (will produce a failing test)', () => {
    cy.visit('/');

    const customThresholds = {
      accessibility: 100, // NOTE: test will fail
      performance: 90,
    };

    const desktopConfig = {
      formFactor: 'desktop',
      screenEmulation: {
        width: 1350,
        height: 940,
        deviceScaleRatio: 1,
        mobile: false,
        disable: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 11024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
    };

    cy.lighthouse(customThresholds, desktopConfig);

    cy.pa11y({
      headers: {
        title: true,
      },
      ignore: ['html-has-lang'],
    });
  });

  const posts = ['ssg-ssr', 'pre-rendering'];
  posts.forEach((post) => {
    it(`audits the ${post} post`, () => {
      cy.visit(`/posts/${post}`);

      cy.lighthouse({
        accessibility: 40,
        'best-practices': 50,
        seo: 50,
        pwa: 20,
        performance: 49,
      });

      cy.pa11y({
        headers: {
          title: true,
        },
        ignore: ['html-has-lang'],
      });
    });
  });
});
