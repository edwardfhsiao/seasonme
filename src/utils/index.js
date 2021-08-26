const _MOCHA_PATH = /\bmocha\b/gi;
const isMochaRunning = process.argv.findIndex(arg => _MOCHA_PATH.test(arg)) > -1;
module.exports = {
  isMochaRunning,
};
