const { fork } = require('child_process')
const CONFIG = require('./config.json')
const events = require('events');
const fs = require('fs');
const util = require('util');
const path = require('path');

const NUM_PARALLELS = CONFIG['num_parallels'];
const EVENT_EMITTER = new events.EventEmitter();
let SPEC_FILES = [];
let SPEC_IDX = 0;
//joining path of directory
const DIR_PATH = path.join(__dirname, CONFIG.specsDir);

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

const spawnJasmineRunner = function(numInstances) {
  for (let n = 0; n < numInstances; n++) {
    let spec_file = path.join(DIR_PATH, SPEC_FILES[SPEC_IDX]);
    let child_process = fork('./jasmine-runner.js', [spec_file]);
    SPEC_IDX++;
    child_process.on('close', function () {
      EVENT_EMITTER.emit('specCompleted', [SPEC_IDX, 1]);
    });
  }
}

async function main() {
  SPEC_FILES = await findAllSpecs(DIR_PATH);
  console.log("Total Spec files to run :: " + SPEC_FILES.length);
  console.log("Spec files to run :: " + SPEC_FILES);

  EVENT_EMITTER.on('specCompleted', spawnJasmineRunner);
  while ((SPEC_IDX < SPEC_FILES.length) && SPEC_IDX < NUM_PARALLELS) {
    spawnJasmineRunner(1);
  }
}

main().then(() => {
  console.log("Completed Running : " + SPEC_FILES.length + " SPEC FILES ");
  process.exit(0);
});
