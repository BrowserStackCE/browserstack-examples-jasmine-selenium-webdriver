const { spawn, fork } = require('child_process')
const CONFIG = require('./config.json')

const CHILD_PROCESSES = [];
const DEVICES = CONFIG['devices'];
const NUM_PARALLELS = CONFIG['num_parallels'];
const specDir = CONFIG.specs.dir;
const specPattern = CONFIG.specs.pattern;
// Find all the specs in the specDir and Pattern
const totalRuns = NUM_PARALLELS // * NUM of Files found in Spec Dir
let runCount = 0;

for (let idx = 0; idx < totalRuns; idx++) {
  // fork the child process here and pass in the spec file based on the idx.
  // runCount++
  // FOR every Child Process forked add a callback on the close to decrement runCount
  // If the runCount == NUM_PARALLELS WAIT
}
for (let idx = 0; idx < DEVICES.length; idx++) {
  let device = DEVICES[idx];
  console.log("Executing specs for Device :: " + JSON.stringify(device));
  let child_process = fork('./jasmine-runner.js', [], {
    env: {
      BROWSERSTACK_USER: CONFIG['username'],
      BROWSERSTACK_ACCESSKEY: CONFIG['accessKey'],
      OS_VERSION: device['os_version'],
      BROWSERNAME: device['browserName'],
      BROWSER_VERSION: device['browser_version'],
      OS: device['os'],
      REAL_MOBILE: device['real_mobile'] || "false",
      BUILD:"Build for Device - " + device['name'], // CI/CD job or build name
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

