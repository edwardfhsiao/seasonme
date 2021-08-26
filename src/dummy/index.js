const fs = require('fs');
const { exec } = require('child_process');
const fsPromises = fs.promises;
const { SHOWS, SEPARATORS, POSTFIXES } = require('../consts/index.js');
const generateSeason = num => {
  return `S${num}`;
};
const generateSeasonWithPad = num => {
  return `S${String(num).padStart(2, '0')}`;
};
const generateSeasonFull = num => {
  return `Season ${num}`;
};
const generateSeasonFullWithPad = num => {
  return `Season ${String(num).padStart(2, '0')}`;
};
const generateSeasonNumber = num => {
  return String(num);
};
const generateSeasonNumberWithPad = num => {
  return String(num).padStart(2, '0');
};
const generateEpisode = num => {
  return `E${num}`;
};
const generateEpisodeWithPad = num => {
  return `E${String(num).padStart(2, '0')}`;
};
const generateEpisodeFull = num => {
  return ` Episode ${num}`;
};
const generateEpisodeFullWithPad = num => {
  return ` Episode ${String(num).padStart(2, '0')}`;
};
const generateEpisodeNumber = num => {
  return `x${num}`;
};
const generateEpisodeNumberWithPad = num => {
  return `x${String(num).padStart(2, '0')}`;
};
const SEASONS = [
  [generateSeason, generateSeasonWithPad],
  [generateSeasonNumber, generateSeasonNumberWithPad],
  [generateSeasonFull, generateSeasonFullWithPad],
];
const EPISODES = [
  [generateEpisode, generateEpisodeWithPad],
  [generateEpisodeNumber, generateEpisodeNumberWithPad],
  [generateEpisodeFull, generateEpisodeFullWithPad],
];
const getRandomInt = max => {
  return Math.floor(Math.random() * max);
};
const splitWithDot = v => v.split(' ').join('.');
const splitWithSpace = v => v;
const SPLITS = [splitWithDot, splitWithSpace];
const before = async pathName => {
  await handleExec(`rm -rf ${pathName}/*`);
};
const handleExec = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
const generateDummyNames = async num => {
  const res = { videos: [], subs: [] };
  for (let i = 0; i < num; i += 1) {
    const show = SPLITS[getRandomInt(SPLITS.length)](SHOWS[getRandomInt(SHOWS.length)]);
    const seIndex = getRandomInt(SEASONS.length);
    const sV = getRandomInt(SEASONS[0].length);
    const eV = getRandomInt(EPISODES[0].length);
    const sS = getRandomInt(SEASONS[0].length);
    const eS = getRandomInt(EPISODES[0].length);
    const sNV = getRandomInt(100);
    const eNV = getRandomInt(100);
    const postfix = POSTFIXES[getRandomInt(POSTFIXES.length)];
    const separatorV = SEPARATORS[getRandomInt(SEPARATORS.length)];
    const separatorS = SEPARATORS[getRandomInt(SEPARATORS.length)];
    const videoFile = `${show}${separatorV}${SEASONS[seIndex][sV](sNV)}${EPISODES[seIndex][eV](eNV)}${separatorV}${postfix}.mkv`;
    const subFile = `${show}${separatorS}${SEASONS[seIndex][sS](sNV)}${EPISODES[seIndex][eS](eNV)}${separatorS}${postfix}.srt`;
    res.videos.push(videoFile);
    res.subs.push(subFile);
  }
  return res;
};
const saveFiles = async (dir, videos, subs) => {
  for (let i = 0; i < videos.length; i += 1) {
    fsPromises
      .appendFile(`${dir}/${videos[i]}`, '')
      .then(() => {})
      .catch(console.log);
    fsPromises
      .appendFile(`${dir}/${subs[i]}`, '')
      .then(() => {})
      .catch(console.log);
  }
};
const generateDummyFiles = async props => {
  const { directory, number } = props;
  const dir = directory || process.cwd();
  await before(dir);
  const { videos, subs } = await generateDummyNames(Number(number));
  await saveFiles(dir, videos, subs);
};
module.exports = {
  generateDummyNames,
  generateDummyFiles,
};
