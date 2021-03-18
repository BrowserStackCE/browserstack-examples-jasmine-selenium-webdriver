
const username = process.env.BROWSERSTACK_USER;
const accessKey = process.env.BROWSERSTACK_ACCESSKEY;
const remoteHubUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

const caps = {
  'os_version': process.env.OS_VERSION,
  'browserName': process.env.BROWSERNAME,
  'browser_version': process.env.BROWSER_VERSON,
  'os': process.env.OS,
  'name': process.env.NAME, // test name
  'build': process.env.BUILD // CI/CD job or build name
}
console.log("Test spec1 initiated with URL :: "+ remoteHubUrl + " CAPS :: " + JSON.stringify(caps));

// Add the code here to run the jasmine tests using the jasmine node module
