const _MOCHA_PATH = /(\/)+[mocha]+/gi;
const isMochaRunning = process.argv.findIndex(arg => _MOCHA_PATH.test(arg)) > -1;
module.exports = {
  isMochaRunning,
};
