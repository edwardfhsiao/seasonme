#! /usr/bin/env node
const { generateDummyFiles } = require('../src/dummy/index.js');
const { format } = require('../src/format/index.js');
const { moveSeriesSubs } = require('../src/subs/series.js');
const { moveMoviesSubs } = require('../src/subs/movies.js');
const R = require('ramda');
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
  .command('movesubs', 'Move subs in series folder', v => {
    const { directory, type } = v.argv;
    const videoType = type === 'series' || type === 'movie' ? type : 'series';
    if (R.isNil(directory)) {
      console.error('Please provide a ' + videoType + ' directory');
      return;
    }
    if (type === 'series') {
      moveSeriesSubs({ directory });
    } else if (type === 'movie') {
      moveMoviesSubs({ directory });
    } else {
      moveSeriesSubs({ directory });
    }
  })
  .example('$0 movesubs -t series -d dir', 'Move subs in series folder (in designate dir)')
  .example(
    '$0 movesubs -t series -d dir',
    'Move subs in one series directory. e.g\n' +
      '│───Twin.Peaks\n' +
      '│       └───Twin.Peaks.S01\n' +
      '│       │     └───Subs\n' +
      '│       │        └───Twin.Peaks.S01E01\n' +
      '│       │              └───English3.srt\n' +
      '│       │              └───English4.srt\n' +
      '│       └───Twin.Peaks.S02\n' +
      '│             └───Subs\n' +
      '│                └───Twin.Peaks.S02E01\n' +
      '│                      └───English3.srt\n' +
      '│                      └───English4.srt\n',
  )
  .example(
    '$0 movesubs -t movies -d dir',
    'Move subs in all movies under one directory. e.g\n' +
      'movies\n' +
      '└───Toy.Story.1995\n' +
      '│       Toy.Story.1995.mkv\n' +
      '│       Subs\n' +
      '│       └───English3.srt\n' +
      '│       └───English4.srt\n' +
      '│       \n' +
      '└───Mission.Impossible.1996\n' +
      '│       Mission.Impossible.1996.mkv\n' +
      '│       Subs\n' +
      '│       └───English3.srt\n' +
      '│       └───English4.srt\n',
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .help()
  .alias('help', 'h')
  .alias('d', 'directory')
  .alias('t', 'type')
  .alias('g', 'generate')
  .alias('n', 'number').argv;
