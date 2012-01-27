/**
 * Puts all of the foounit keywords in the global scope
 */
foounit.globalize();

var driver = foounit.require(':lib/driver');

// Configure the driver
driver.configure({
/**
 * Browser type: Chrome, Internet Explorer, Firefox, WebDriver
 */
  browser: process.env.BROWSER || 'Chrome'

/**
 * Path to look for fixture files.  Used by fixture.load.  The path can contain
 * foounit mounts.
 */
, fixtures: ':fixtures'

/**
 * Creates N reusable browsers in the a browser pool.
 * If N is 0 create a fresh browser every time.
 * If N is less then then number of browsers required for the test, then create the
 * additional browsers needed, but close the excess browsers when the test is over.
 */
, browserPool: 0                      // creates a new browser every time

/**
 * Max memory usage per browser instance.  A browser is restarted if it is using
 * more memory than after a test.
 */
, maxMemoryMB: 200 // 0 means never restart

/**
 * Stop running tests if there is a failure
 */
, stopOnFailure: false               // default false

/**
 * Max time to wait for a browser to start
 */
, maxStartMillis: 10000
});
