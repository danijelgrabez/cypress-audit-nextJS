/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const { lighthouse, pa11y, prepareAudit } = require('cypress-audit');

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--disable-gpu');
      return launchOptions;
    }
  });

  /**
   * NOTE: Bare config
   * Reports are exposed in Cypress console
   */
  on('task', {
    lighthouse: lighthouse(),
    pa11y: pa11y(console.log.bind(console)),
  });

};
