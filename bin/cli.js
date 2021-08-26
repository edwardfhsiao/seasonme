#! /usr/bin/env node
const { generateDummyFiles } = require('../src/dummy/index.js');
const { format } = require('../src/format/index.js');
const yargs = require('yargs');
yargs
  .command('format', 'Formatting the files', v => {
    const { directory } = v.argv;
    format({ directory });
  })
  .example('$0 format', 'Format mvk and srt (in current dir)')
  .example('$0 format -d dir', 'Format mvk and srt (in designate dir)')
  .command('generate', 'Generate dummy files', v => {
    const { directory, number } = v.argv;
    generateDummyFiles({ directory, number });
  })
  .example('$0 generate -n 4', 'Generate 4 files (in current dir)')
  .example('$0 generate -d dir -n 4', 'Generate 4 files (in designate dir)')
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .help()
  .alias('help', 'h')
  .alias('d', 'directory')
  .alias('g', 'generate')
  .alias('n', 'number').argv;
