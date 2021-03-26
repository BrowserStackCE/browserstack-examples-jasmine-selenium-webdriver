const {fork} = require('child_process')
const CONFIG = require('./config.json')
const events = require('events');
const fs = require('fs');
const util = require('util');
const path = require('path');

const NUM_PARALLELS = CONFIG.num_parallels;
const USERNAME = CONFIG.user;
const ACCESS_KEY = CONFIG.accessKey;
const BUILD = CONFIG.build + " - " + Date.now();

const EVENT_EMITTER = new events.EventEmitter();
let SPEC_RUN_IDX = 0;
let SPEC_RUNS_DEVICE = [];
const REMOTE_HUB_URL = `https://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`;

function SpecRun(specFileName, specFilePath, device) {
  this.specFileName = specFileName;
  this.specFilePath = specFilePath;
  this.capabilities = device;
  this.capabilities.name = specFileName + " - " + this.capabilities.name;
}

SpecRun.prototype.getCapabilitiesAsStr = function () {
  return JSON.stringify(this.capabilities);
}

SpecRun.prototype.getSpecFilePath = function () {
  return this.specFilePath;
}

SpecRun.prototype.getSpecFileName = function () {
  return this.specFileName;
}

async function findAllSpecs(specDir) {
  console.log("Finding Specs in Directory :: " + specDir);
  const readdir = util.promisify(fs.readdir);
  let specFiles;

  try {
    specFiles = await readdir(specDir);
  } catch (e) {
    console.log("Error while reading specs from dir :: " + specDir);
  }
  if (specFiles === undefined) {
    specFiles = [];
  }
  return specFiles;
}

async function calculateSpecRuns(config) {
  let specDirPath = path.join(__dirname, config.specsDir);
  let specFiles = await findAllSpecs(specDirPath);
  console.log(`Found ${specFiles.length} Spec files to run`);
  let device_caps = config.device_caps;
  let specRunsForDevice = [];
  // iterate over the number of devices and for each spec and device create
  // an entry in an Array of SpecRun
  for (let specIdx = 0; specIdx < specFiles.length; specIdx++) {
    let specFile = specFiles[specIdx];
    let specFilePath = path.join(specDirPath, specFile);
    for (let devIdx = 0; devIdx < device_caps.length; devIdx++) {
      let capabilities = device_caps[devIdx];
      let common_caps = config['common_caps'];
      let common_caps_keys = Object.keys(common_caps);
      common_caps_keys.forEach((key, index) => {
        capabilities[key] = common_caps[key];
      });
      capabilities.build = BUILD;
      console.log(`CAPS : ${JSON.stringify(capabilities)}`);
      let specRunDev = new SpecRun(specFile, specFilePath, capabilities);
      specRunsForDevice.push(specRunDev);
    }
  }
  // return this array from this function
  return specRunsForDevice;
}

const spawnJasmineRunner = function () {
  console.log(`SPEC RUN IDX : ${SPEC_RUN_IDX} SPEC RUNS : ${SPEC_RUNS_DEVICE.length}`);
  if (SPEC_RUN_IDX >= SPEC_RUNS_DEVICE.length) {
    return;
  }
  let specRun = SPEC_RUNS_DEVICE[SPEC_RUN_IDX];
  console.log(`ARGS : ${specRun.getSpecFilePath()} URL : ${REMOTE_HUB_URL} CAPS : ${specRun.getCapabilitiesAsStr()}`);
  let child_process = fork('./jasmine-runner.js',
    [specRun.getSpecFilePath(), REMOTE_HUB_URL, specRun.getCapabilitiesAsStr()]);

  child_process.on('close', function () {
    EVENT_EMITTER.emit('specCompleted');
    SPEC_RUN_IDX++;
  });
}

async function main() {
  SPEC_RUNS_DEVICE = await calculateSpecRuns(CONFIG);
  console.log(`Total Spec Runs :: ${SPEC_RUNS_DEVICE.length}`);

  EVENT_EMITTER.on('specCompleted', spawnJasmineRunner);
  while (SPEC_RUN_IDX < SPEC_RUNS_DEVICE.length && SPEC_RUN_IDX < NUM_PARALLELS) {
    spawnJasmineRunner();
    SPEC_RUN_IDX++;
  }
}

main().then(() => {
  console.log("Completed Test execution.");
});
