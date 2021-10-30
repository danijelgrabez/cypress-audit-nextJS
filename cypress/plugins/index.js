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
const ReportGenerator = require('lighthouse/report/generator/report-generator');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

const reportT = {
  lh: 'lh',
  pa11y: 'pa11y',
};
/**
 * Create a11y or Lighthouse report
 */
const createReport = ({ report, pageUrl, reportType }) => {
  const dateFormat = format(Date.now(), 'dd.MM.yyyy_HH:mm');
  const [_, fPath] = pageUrl.split('http://localhost:3000/');
  const folderPath = fPath || 'home';
  const ext = reportType === reportT.lh ? 'html' : 'json';
  const reportName = `${dateFormat}_${reportType}_report.${ext}`;

  // Organize reports
  fs.mkdir(`cypress/reports/${folderPath}`, { recursive: true }, (err) => {
    if (err) throw err;

    if (reportType === reportT.lh) {
      fs.writeFileSync(
        path.resolve(process.cwd(), `cypress/reports/${folderPath}/${reportName}`),
        ReportGenerator.generateReport(report, 'html')
      );
    }

    if (reportType === reportT.pa11y) {
      fs.writeFileSync(
        path.resolve(process.cwd(), `cypress/reports/${folderPath}/${reportName}`),
        JSON.stringify(report, null, 2),
        'utf-8'
      );
    }
  });
};

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
  // on('task', {
  //   lighthouse: lighthouse(),
  //   pa11y: pa11y(console.log.bind(console)),
  // });

  /**
   * NOTE: Custom config
   * Reports are stored in `cypress/reports` folder
   */
  on('task', {
    lighthouse: lighthouse((lighthouseReport) => {
      // console.log(lighthouseReport); // raw lighthouse reports
      createReport({
        report: lighthouseReport.lhr,
        pageUrl: lighthouseReport.lhr.requestedUrl,
        reportType: reportT.lh,
      });
    }),

    /**
     * NOTE: It is possible to create a custom report for pa11y as well
     */
    pa11y: pa11y((pa11yReport) => {
      console.log(pa11yReport); // raw pa11y reports
      createReport({
        report: pa11yReport,
        pageUrl: pa11yReport.pageUrl,
        reportType: reportT.pa11y,
      });
    }),
  });
};
