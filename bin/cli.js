#! /usr/bin/env node
const generateDummyFIles = require('../src/scripts/generate-dummy-files/script.js');
const format = require('../src/scripts/organize-file-names/script.js');
// import generateDummyFIles from '../src/scripts/generate-dummy-files'
// generateDummyFIles();
// var shell = require("shelljs");

// shell.exec("echo cli" + process.argv[2] + process.argv[3]);

const chalk = require('chalk');
const boxen = require('boxen');
const fs = require('fs');
const PATH_NAME = process.cwd() + '/src/scripts/organize-file-names/dummy-files';

// require('yargs')
//   .scriptName("pirate-parser")
//   .usage('$0 <cmd> [args]')
//   .command('h [name]', 'welcome ter yargs!', (yargs) => {
//     yargs.positional('name', {
//       type: 'string',
//       default: 'Cambi',
//       describe: 'the name to say hello to'
//     })
//   },  (argv) => {
//     console.log('hello', argv.name, 'welcome to yargs!')
//   })
//   .help()
//   .argv

const yargs = require('yargs');
const argv = yargs
  .command('format', 'Formatting the files', v => {
    const { directory } = v.argv;
    format({ directory });
  })
  .example('$0 format -d dir', '====> Format mvk and srt')
  .command('generate', 'Generate dummy files', v => {
    const { directory, number } = v.argv;
    generateDummyFIles({ directory, number });
  })
  .example('$0 generate -d dir -n 4', '====> Generate 4 files')
  .help()
  .alias('help', 'h')
  .alias('d', 'directory')
  .alias('g', 'generate')
  .alias('n', 'number').argv;
// console.log(argv);

// fsPromises
//   .appendFile(`${PATH_NAME}/b.txt`, '')
//   .then(() => {})
//   .catch(console.log);

const greeting = chalk.white.bold(PATH_NAME);

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
  borderColor: 'green',
  backgroundColor: '#555555',
};
const msgBox = boxen(greeting, boxenOptions);

// console.log(msgBox);
