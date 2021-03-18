const { spawn, fork } = require('child_process')
const CONFIG = require('./devices.json')

const CHILD_PROCESSES = [];
const DEVICES = CONFIG['devices'];
for (let idx = 0; idx < DEVICES.length; idx++) {
  let device = DEVICES[idx];
  console.log("Executing specs for Device :: " + JSON.stringify(device));
  let child_process = fork('./runner.js', [], {
    env: {
      BROWSERSTACK_USER: CONFIG['username'],
      BROWSERSTACK_ACCESSKEY: CONFIG['accessKey'],
      OS_VERSION: device['os_version'],
      BROWSERNAME: device['browserName'],
      BROWSER_VERSION: device['browser_version'],
      OS: device['os'],
      REAL_MOBILE: device['real_mobile'] || "false",
      BUILD:"Build for Device :: " + device, // CI/CD job or build name
    }
  });
  CHILD_PROCESSES.push(child_process);
}

console.log("Number of Processes Forked :: " + CHILD_PROCESSES.length);
for (let i = 0; i < CHILD_PROCESSES.length; i++) {
  let cp = CHILD_PROCESSES[i];
  cp.on('close', function () {
    console.log("Closed Child Process :: " + JSON.stringify(cp));
  });
}

