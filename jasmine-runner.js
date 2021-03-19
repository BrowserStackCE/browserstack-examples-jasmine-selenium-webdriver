const Jasmine = require('jasmine');
const CONFIG = require('./config.json')

const spec_file = process.argv[2];
const username = CONFIG.user || process.env.BROWSERSTACK_USER;
const accessKey = CONFIG.accessKey || process.env.BROWSERSTACK_ACCESSKEY;
const remoteHubUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

const DEVICES = CONFIG.devices;
for (let idx = 0; idx < DEVICES.length; idx++) {
  const device = DEVICES[idx];
  process.env.OS_VERSION = device.os_version;
  process.env.BROWSERNAME = device.browserName;
  process.env.BROWSER_VERSON = device.browser_version;
  process.env.OS = device.os;
  process.env.REAL_MOBILE = device.real_mobile;
  console.log("Will Execute Test spec " + spec_file + " URL :: "+ remoteHubUrl + " INDEX " + idx + " DEVICE :: " + JSON.stringify(device));
  // const jasmine = new Jasmine();
  // jasmine.execute([spec_file]);
}


// Add the code here to run the jasmine tests using the jasmine node module
