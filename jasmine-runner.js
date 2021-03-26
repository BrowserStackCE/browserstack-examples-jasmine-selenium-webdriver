const Jasmine = require('jasmine');

const SPEC_FILE = process.argv[2];
const REMOTE_HUB_URL = process.argv[3];
const CAPABILITIES = process.argv[4];

console.log(`Executing Jasmine for URL : ${REMOTE_HUB_URL} SPEC : ${SPEC_FILE} CAPABILITIES : ${CAPABILITIES}`);

process.env.REMOTE_HUB_URL = REMOTE_HUB_URL;
process.env.CAPABILITIES = CAPABILITIES;

const jasmine = new Jasmine();
jasmine.execute([SPEC_FILE]).then(() => {
  console.log(`Executed SPEC ${SPEC_FILE}`);
});
