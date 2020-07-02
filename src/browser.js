/* Ricky created */
const puppeteer = require('puppeteer');
const _ = require('lodash');
const config = require('./config');
const logger = require('./util/logger')(__filename);

async function createBrowser() {
	// Create opts
	const opts = { ignoreHttpsErrors: true };
  const browserOpts = {
    ignoreHTTPSErrors: opts.ignoreHttpsErrors,
    sloMo: config.DEBUG_MODE ? 250 : undefined,
  };
  if (config.BROWSER_WS_ENDPOINT) {
    browserOpts.browserWSEndpoint = config.BROWSER_WS_ENDPOINT;
    return puppeteer.connect(browserOpts);
  }
  if (config.BROWSER_EXECUTABLE_PATH) {
    browserOpts.executablePath = config.BROWSER_EXECUTABLE_PATH;
  }
  browserOpts.headless = !config.DEBUG_MODE;
  browserOpts.args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (!opts.enableGPU || navigator.userAgent.indexOf('Win') !== -1) {
    browserOpts.args.push('--disable-gpu');
  }

	// [Ricky] To avoid request throttling when error
	browserOpts.args.push('--disable-extensions-http-throttling');

  return puppeteer.launch(browserOpts);
}

async function launchChrome() {
  const browser = await createBrowser();
	console.log("Chrome browser ready! press ctrl + c to close browser");
	return browser;
}

let chromeBrowser = launchChrome();

const getBrowser = () => {
  return chromeBrowser;
}

module.exports = {
	getBrowser
}
