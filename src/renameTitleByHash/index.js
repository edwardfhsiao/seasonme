const klawSync = require('klaw-sync');
const fs = require('fs');
const fsPromises = fs.promises;
const { isMochaRunning } = require('../utils/index.js');
const { PREFIX, CASES, X_REGEX, S_REGEX, E_REGEX, SEASON_REGEX, EPISODE_REGEX, SYMBOL_AND_REGEX, SYMBOL_DOT_REGEX, VIDEO_EXTS, SUB_EXTS } = require('../consts/index.js');
const chalk = require('chalk');
const boxen = require('boxen');
const { mainModule } = require('process');
const log = chalk.bold.hex('#ffffff');
const error = chalk.bold.hex('#ffffff');
const boxenOptionsLog = {
  padding: 2,
  margin: 2,
  borderColor: '#54c754',
  backgroundColor: '#54c754',
};
const boxenOptionsError = {
  padding: 2,
  margin: 2,
  borderColor: '#c75454',
  backgroundColor: '#c75454',
};
const renderMyLog = msg => boxen(log(msg), boxenOptionsLog);
const renderMyError = msg => boxen(error(msg), boxenOptionsError);
const getFiles = pathName => {
  const files = klawSync(pathName, { nodir: true })
    .map(item => item.path)
    .filter(path => path.split('/').slice(-1)[0][0] !== '.');
  return files;
};
const getFileName = file => {
  const start = file.lastIndexOf('/') + 1;
  const end = file.lastIndexOf('.');
  const fileName = file.substr(start, end - start);
  const ext = file.substr(end, file.length);
  return [fileName, ext];
};
const formatVideoName = f => {
  f = f.split(' ').join('.').replace(/\.-\./g, '.').replace(/\.\./g, '.');
  const symbolANDMatches = f.match(SYMBOL_AND_REGEX);
  if (symbolANDMatches) {
    f = f.replace(symbolANDMatches[0], symbolANDMatches[0].replace(/.&.E/gi, 'E'));
    return formatVideoName(f);
  }
  const symbolDOTMatches = f.match(SYMBOL_DOT_REGEX);
  if (symbolDOTMatches) {
    f = f.replace(symbolDOTMatches[0], symbolDOTMatches[0].replace(/.E/gi, 'E'));
    return formatVideoName(f);
  }
  const seasonMatches = f.match(SEASON_REGEX);
  if (seasonMatches) {
    f = f.replace(seasonMatches[0], seasonMatches[0].replace(/season./gi, 'S'));
    return formatVideoName(f);
  }
  const episodeMatches = f.match(EPISODE_REGEX);
  if (episodeMatches) {
    f = f.replace(episodeMatches[0], episodeMatches[0].replace(/episode./gi, 'E'));
    return formatVideoName(f);
  }
  return f;
};
const findNamingCase = f => {
  if (f.match(X_REGEX)) {
    return CASES[0];
  }
  if (f.match(S_REGEX) && f.match(E_REGEX)) {
    return CASES[1];
  }
  if (f.match(SEASON_REGEX) && f.match(EPISODE_REGEX)) {
    return CASES[2];
  }
};
const getCaseXInfoObj = f => {
  const matches = f.match(X_REGEX)[0].toLowerCase().split('x');
  if (matches.length >= 2) {
    const newMatches = [...matches];
    newMatches.shift();
    const paddedInfos = newMatches.map(i => i.padStart(2, '0'));
    return { season: `S${matches[0].padStart(2, '0')}`, episode: `E${paddedInfos.join('E')}`, matches, case: CASES[0] };
  }
  return { season: 'S-1', episode: 'E-1' };
};
const getCaseAbbrInfoObj = f => {
  const seasonMatches = f.match(S_REGEX);
  const episodesMatches = f.match(E_REGEX);
  if (seasonMatches && episodesMatches) {
    const sNumber = seasonMatches[0].replace(/s/gi, '');
    const eNumbers = episodesMatches.map(i => i.replace(/e/gi, '').padStart(2, '0'));
    return { season: `S${sNumber.padStart(2, '0')}`, episode: `E${eNumbers.join('E')}`, matches: [...seasonMatches, ...episodesMatches], case: CASES[1] };
  }
  return { season: 'S-1', episode: 'E-1' };
};
const getCaseFullInfoObj = f => {
  const seasonMatches = f.match(SEASON_REGEX);
  const episodesMatches = f.match(EPISODE_REGEX);
  if (seasonMatches && episodesMatches) {
    const sNumber = seasonMatches[0].replace(/season/gi, '').replace(/\./g, '');
    const eNumbers = episodesMatches.map(i =>
      i
        .replace(/episode/gi, '')
        .replace(/\./g, '')
        .padStart(2, '0'),
    );
    return { season: `S${sNumber.padStart(2, '0')}`, episode: `E${eNumbers.join('E')}`, matches: [...seasonMatches, ...episodesMatches], case: CASES[2] };
  }
  return { season: 'S-1', episode: 'E-1' };
};
const getSequenceInfo = f => {
  switch (findNamingCase(f)) {
    case CASES[0]: {
      return getCaseXInfoObj(f);
    }
    case CASES[1]: {
      return getCaseAbbrInfoObj(f);
    }
    case CASES[2]: {
      return getCaseFullInfoObj(f);
    }
  }
};
const getVideoNamingHash = async files => {
  const fileNamesHash = {};
  for (const file of files) {
    const [fileName, ext] = getFileName(file);
    if (VIDEO_EXTS.includes(ext)) {
      const sequenceInfo = getSequenceInfo(fileName);
      fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`] = fileName;
    }
  }
  return fileNamesHash;
};
const OPTIONS = {
  dir: process.argv[2],
};
const main = async () => {
  const files = getFiles(OPTIONS.dir);
  const hash = {
    S01E01: 'The Pilot',
    S01E02: 'The One With the Sonogram at the End',
    S01E03: 'The One With the Thumb',
    S01E04: 'The One With George Stephanopoulos',
    S01E05: 'The One With the East German Laundry Detergent',
    S01E06: 'The One With the Butt',
    S01E07: 'The One With the Blackout',
    S01E08: 'The One Where Nana Dies Twice',
    S01E09: 'The One Where Underdog Gets Away',
    S01E10: 'The One With the Monkey',
    S01E11: 'The One With Mrs Bing',
    S01E12: 'The One With the Dozen Lasagnas',
    S01E13: 'The One With the Boobies',
    S01E14: 'The One With the Candy Hearts',
    S01E15: 'The One With the Stoned Guy',
    S01E16: 'The One With Two Parts, Part 1',
    S01E17: 'The One With Two Parts, Part 2',
    S01E18: 'The One With All the Poker',
    S01E19: 'The One Where the Monkey Gets Away',
    S01E20: 'The One with the Evil Orthodontist',
    S01E21: 'The One with Fake Monica',
    S01E22: 'The One with the Ick Factor',
    S01E23: 'The One with the Birth',
    S01E24: 'The One where Rachel Finds Out',
    S02E01: "The One With Ross' New Girlfriend",
    S02E02: 'The One With the Breast Milk',
    S02E03: 'The One Where Heckles Dies',
    S02E04: "The One With Phoebe's Husband",
    S02E05: 'The One With Five Steaks and an Eggplant',
    S02E06: 'The One With the Baby on the Bus',
    S02E07: 'The One Where Ross Finds Out',
    S02E08: 'The One With the List',
    S02E09: "The One With Phoebe's Dad",
    S02E10: 'The One With Russ',
    S02E11: 'The One With The Lesbian Wedding',
    S02E12: 'The One After the Superbowl, Part 1',
    S02E13: 'The One After the Superbowl, Part 2',
    S02E14: 'The One With The Prom Video',
    S02E15: 'The One Where Ross and RachelYou Know',
    S02E16: 'The One Where Joey Moves Out',
    S02E17: 'The One Where Eddie Moves In',
    S02E18: 'The One Where Dr Ramoray Dies',
    S02E19: "The One Where Eddie Won't Go",
    S02E20: 'The One Where Old Yeller Dies',
    S02E21: 'The One With The Bullies',
    S02E22: 'The One With Two Parties',
    S02E23: 'The One With The Chicken Pox',
    S02E24: "The One With Barry & Mindy's Wedding",
    S03E01: 'The One With The Princess Leia Fantasy',
    S03E02: "The One Where No One's Ready",
    S03E03: 'The One With The Jam',
    S03E04: 'The One With The Metaphorical Tunnel',
    S03E05: 'The One With Frank, Jr',
    S03E06: 'The One With The Flashback',
    S03E07: 'The One With The Racecar Bed',
    S03E08: 'The One With The Giant Poking Device',
    S03E09: 'The One With The Football',
    S03E10: 'The One Where Rachel Quits',
    S03E11: "The One Where Chandler Can't Remember Which Sister",
    S03E12: 'The One With All The Jealousy',
    S03E13: 'The One Where Monica and Richard Are Just Friends',
    S03E14: "The One With Phoebe's Ex-Partner",
    S03E15: 'The One Where Ross And Rachel Take A Break',
    S03E16: 'The One The Morning After',
    S03E17: 'The One Without The Ski Trip',
    S03E18: 'The One With The Hypnosis Tape',
    S03E19: 'The One With The Tiny T-Shirt',
    S03E20: 'The One With The Dollhouse',
    S03E21: 'The One With a Chick And a Duck',
    S03E22: 'The One With The Screamer',
    S03E23: "The One With Ross's Thing",
    S03E24: 'The One With The Ultimate Fighting Champion',
    S03E25: 'The One At The Beach',
    S04E01: 'The One With The Jellyfish',
    S04E02: 'The One With The Cat',
    S04E03: "The One With The 'Cuffs",
    S04E04: 'The One With The Ballroom Dancing',
    S04E05: "The One With Joey's New Girlfriend",
    S04E06: 'The One With The Dirty Girl',
    S04E07: 'The One Where Chandler Crosses The Line',
    S04E08: 'The One With Chandler In A Box',
    S04E09: "The One Where They're Going To PARTY!",
    S04E10: 'The One With The Girl From Poughkeepsie',
    S04E11: "The One With Phoebe's Uterus",
    S04E12: 'The One With The Embryos',
    S04E13: "The One With Rachel's Crush",
    S04E14: "The One With Joey's Dirty Day",
    S04E15: 'The One With All The Rugby',
    S04E16: 'The One With The Fake Party',
    S04E17: 'The One With The Free Porn',
    S04E18: "The One With Rachel's New Dress",
    S04E19: 'The One With All The Haste',
    S04E20: 'The One With All The Wedding Dresses',
    S04E21: 'The One With The Invitation',
    S04E22: 'The One With The Worst Best Man Ever',
    S04E23: "The One With Ross's Wedding, Part 1",
    S04E24: "The One With Ross's Wedding, Part 2",
    S05E01: 'The One After Ross Says Rachel',
    S05E02: 'The One With All The Kissing',
    S05E03: 'The One With The Triplets',
    S05E04: 'The One Where Phoebe Hates PBS',
    S05E05: 'The One With The Kips',
    S05E06: 'The One With The Yeti',
    S05E07: 'The One Where Ross Moves In',
    S05E08: 'The One With All The Thanksgivings',
    S05E09: "The One With Ross's Sandwich",
    S05E10: 'The One With The Inappropriate Sister',
    S05E11: 'The One With All The Resolutions',
    S05E12: "The One With Chandler's Work Laugh",
    S05E13: "The One With Joey's Bag",
    S05E14: 'The One Where Everybody Finds Out',
    S05E15: 'The One With The Girl Who Hits Joey',
    S05E16: 'The One With The Cop',
    S05E17: "The One With Rachel's Inadvertent Kiss",
    S05E18: 'The One Where Rachel Smokes',
    S05E19: "The One Where Ross Can't Flirt",
    S05E20: 'The One With The Ride-Along',
    S05E21: 'The One With The Ball',
    S05E22: "The One With Joey's Big Break",
    S05E23: 'The One In Vegas, Part 1',
    S05E24: 'The One In Vegas, Part 2',
    S06E01: 'The One After Vegas',
    S06E02: 'The One Where Ross Hugs Rachel',
    S06E03: "The One With Ross's Denial",
    S06E04: 'The One Where Joey Loses His Insurance',
    S06E05: "The One With Joey's Porsche",
    S06E06: 'The One On The Last Night',
    S06E07: 'The One Where Phoebe Runs',
    S06E08: "The One With Ross's Teeth",
    S06E09: 'The One Where Ross Got High',
    S06E10: 'The One With The Routine',
    S06E11: 'The One With The Apothecary Table',
    S06E12: 'The One With The Joke',
    S06E13: "The One With Rachel's Sister",
    S06E14: "The One Where Chandler Can't Cry",
    S06E15: 'The One That Could Have Been, Part 1',
    S06E16: 'The One That Could Have Been, Part 2',
    S06E17: 'The One With Unagi',
    S06E18: 'The One Where Ross Dates a Student',
    S06E19: "The One With Joey's Fridge",
    S06E20: 'The One With Mac & CHEESE',
    S06E21: "The One Where Ross Meets Elizabeth's Dad",
    S06E22: "The One Where Paul's The Man",
    S06E23: 'The One With The Ring',
    S06E24: 'The One With The Proposal, Part 1',
    S06E25: 'The One With The Proposal, Part 2',
    S07E01: "The One With Monica's Thunder",
    S07E02: "The One With Rachel's Book",
    S07E03: "The One With Phoebe's Cookies",
    S07E04: "The One With Rachel's Assistant",
    S07E05: 'The One With The Engagement Picture',
    S07E06: 'The One With The Nap Partners',
    S07E07: "The One With Ross's Library Book",
    S07E08: "The One Where Chandler Doesn't Like Dogs",
    S07E09: 'The One With All The Candy',
    S07E10: 'The One With the Holiday Armadillo',
    S07E11: 'The One With All The Cheesecakes',
    S07E12: "The One Where They're Up All Night",
    S07E13: 'The One Where Rosita Dies',
    S07E14: 'The One Where They All Turn Thirty',
    S07E15: "The One With Joey's New Brain",
    S07E16: 'The One With The Truth About London',
    S07E17: 'The One With The Cheap Wedding Dress',
    S07E18: "The One With Joey's Award",
    S07E19: "The One With Ross and Monica's Cousin",
    S07E20: "The One With Rachel's Big Kiss",
    S07E21: 'The One With The Vows',
    S07E22: "The One With Chandler's Dad",
    S07E23: "The One With Monica and Chandler's Wedding, Part 1",
    S07E24: "The One With Monica and Chandler's Wedding, Part 2",
    S08E01: 'The One After "I Do"',
    S08E02: 'The One With The Red Sweater',
    S08E03: 'The One Where Rachel Tells',
    S08E04: 'The One With The Video Tape',
    S08E05: "The One With Rachel's Date",
    S08E06: 'The One With The Halloween Party',
    S08E07: 'The One With The Stain',
    S08E08: 'The One With The Stripper',
    S08E09: 'The One With The Rumor',
    S08E10: "The One With Monica's Boots",
    S08E11: "The One With Ross' Step Forward",
    S08E12: 'The One Where Joey Dates Rachel',
    S08E13: 'The One Where Chandler Takes a Bath',
    S08E14: 'The One With The Secret Closet',
    S08E15: 'The One With The Birthing Video',
    S08E16: 'The One Where Joey Tells Rachel',
    S08E17: 'The One With The Tea Leaves',
    S08E18: 'The One In Massapequa',
    S08E19: "The One With Joey's Interview",
    S08E20: 'The One With The Baby Shower',
    S08E21: 'The One With The Cooking Class',
    S08E22: 'The One Where Rachel is Late',
    S08E23: 'The One Where Rachel Has a Baby, Part 1',
    S08E24: 'The One Where Rachel Has a Baby, Part 2',
    S09E01: 'The One Where No One Proposes',
    S09E02: 'The One Where Emma Cries',
    S09E03: 'The One With the Pediatrician',
    S09E04: 'The One With the Sharks',
    S09E05: "The One With Phoebe's Birthday Dinner",
    S09E06: 'The One With the Male Nanny',
    S09E07: "The One With Ross's Inappropriate Song",
    S09E08: "The One With Rachel's Other Sister",
    S09E09: "The One With Rachel's Phone Number",
    S09E10: 'The One With Christmas in Tulsa',
    S09E11: 'The One Where Rachel Goes Back To Work',
    S09E12: "The One With Phoebe's Rats",
    S09E13: 'The One Where Monica Sings',
    S09E14: 'The One With The Blind Dates',
    S09E15: 'The One With The Mugging',
    S09E16: 'The One With The Boob Job',
    S09E17: 'The One With The Memorial Service',
    S09E18: 'The One With The Lottery',
    S09E19: "The One With Rachel's Dream",
    S09E20: 'The One With The Soap Opera Party',
    S09E21: 'The One With The Fertility Test',
    S09E22: 'The One With The Donor',
    S09E23E24: 'The One In Barbados',
    S10E01: 'The One After Joey and Rachel Kiss',
    S10E02: 'The One Where Ross is Fine',
    S10E03: "The One With Ross's Tan",
    S10E04: 'The One With the Cake',
    S10E05: "The One Where Rachel's Sister Baby-sits",
    S10E06: "The One With Ross's Grant",
    S10E07: 'The One With the Home Study',
    S10E08: 'The One With the Late Thanksgiving',
    S10E09: 'The One With The Birth Mother',
    S10E10: 'The One Where Chandler Gets Caught',
    S10E11: 'The One Where The Stripper Cries',
    S10E12: "The One With Phoebe's Wedding",
    S10E13: 'The One Where Joey Speaks French',
    S10E14: 'The One With Princess Consuela',
    S10E15: 'The One Where Estelle Dies',
    S10E16: "The One With Rachel's Going Away Party",
    S10E17E18: 'The Last One',
  };
  // Object.keys(hash).forEach(key => {
  //   fsPromises
  //     // .appendFile(`${OPTIONS.dir}/Friends.${key}.${hash[key].replace(/,/g, '').split(' ').join('.')}.mkv`, '')
  //     .appendFile(`${OPTIONS.dir}/Friends.${key}.1080p.BluRay.x264-TENEIGHTY.mkv`, '')
  //     .then(() => {})
  //     .catch(console.log);
  // });
  // return;
  // handle formatting video name
  await handleVideoRenaming(files, hash);
  console.log(renderMyLog('Renamed Successfully!'));
};
const handleVideoRenaming = async (files, hash) => {
  const res = [];
  for (const file of files) {
    const [fileName, ext] = getFileName(file);
    if (VIDEO_EXTS.includes(ext)) {
      let newFileName = formatVideoName(fileName);
      const sequenceInfo = getSequenceInfo(newFileName);
      if (!sequenceInfo) {
        console.log(renderMyError('No season info, make sure the mkv file name follows {showname}.S01E01'));
        return;
      }
      const replacer = new RegExp(`(${sequenceInfo.matches.join(sequenceInfo.case === CASES[0] ? 'x' : '')})`, 'gi');
      newFileName = newFileName.replace(replacer, `${sequenceInfo.season}${sequenceInfo.episode}.${hash[`${sequenceInfo.season}${sequenceInfo.episode}`]}`.replace(/,/g, '').split(' ').join('.')).replace('bluray', 'BluRay');
      res.push(file.replace(fileName, newFileName));
      if (!isMochaRunning) {
        const tempFileName = file.replace(fileName, `${PREFIX}${newFileName}`);
        try {
          await fs.promises.rename(file, tempFileName);
        } catch (err) {
          console.log(renderMyError('Failed to rename'));
        }
        try {
          await fs.promises.rename(tempFileName, tempFileName.replace(PREFIX, ''));
        } catch (err) {
          console.log(renderMyError('Failed to rename'));
        }
      }
    }
  }
  return res;
};
main();
