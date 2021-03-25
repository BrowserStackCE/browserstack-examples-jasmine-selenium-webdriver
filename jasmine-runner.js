const Jasmine = require('jasmine');
const CONFIG = require('./config.json')
const events = require('events');

const spec_file = process.argv[2];
const username = CONFIG.user || process.env.BROWSERSTACK_USER;
const accessKey = CONFIG.accessKey || process.env.BROWSERSTACK_ACCESSKEY;
const remoteHubUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

const DEVICES = CONFIG.devices;

// async function executeJasmine(jasmine) {
function executeJasmine(jasmine) {
  for (let idx = 0; idx < DEVICES.length; idx++) {
    const device = DEVICES[idx];
    process.env.OS_VERSION = device.os_version;
    process.env.BROWSERNAME = device.browserName;
    process.env.BROWSER_VERSION = device.browser_version;
    process.env.OS = device.os;
    process.env.REAL_MOBILE = device.real_mobile;
    console.log(`TEST SPEC : ${spec_file} URL :: ${remoteHubUrl} DEVICE :: ${JSON.stringify(device)}`);
    // await jasmine.execute([spec_file]);
  }
}

const jasmine = new Jasmine();
executeJasmine(jasmine);
// executeJasmine(jasmine).then(function () {
//   console.log("Completed Executing Jasmine Runner");
// });

// Add the code here to run the jasmine tests using the jasmine node module
