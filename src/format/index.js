const klawSync = require('klaw-sync');
const fs = require('fs');
const { isMochaRunning } = require('../utils/index.js');
const { CASES, X_REGEX, S_REGEX, E_REGEX, SEASON_REGEX, EPISODE_REGEX, SYMBOL_AND_REGEX, SYMBOL_DOT_REGEX, VIDEO_EXTS, SUB_EXTS } = require('../consts/index.js');
const chalk = require('chalk');
const boxen = require('boxen');
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
const handleVideoRenaming = async files => {
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
      newFileName = newFileName.replace(replacer, `${sequenceInfo.season}${sequenceInfo.episode}`.toUpperCase()).replace('bluray', 'BluRay');
      res.push(file.replace(fileName, newFileName));
      if (!isMochaRunning) {
        await fs.promises.rename(file, file.replace(fileName, newFileName));
      }
    }
  }
  return res;
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
const handleSubRenaming = async (files, fileNamesHash) => {
  const res = [];
  for (const file of files) {
    const [fileName, ext] = getFileName(file);
    if (SUB_EXTS.includes(ext)) {
      let newFileName = formatVideoName(fileName);
      const sequenceInfo = getSequenceInfo(newFileName);
      if (fileName.includes('中文') || fileName.includes('简体') || fileName.includes('chs')) {
        res.push(file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`]));
        if (!isMochaRunning) {
          await fs.promises.rename(file, file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`] + '.中文字幕'));
        }
      } else {
        if (!sequenceInfo) {
          console.log(renderMyError('No episode info, make sure the srt file name follows {showname}.S01E01'));
          return;
        }
        res.push(file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`]));
        if (!isMochaRunning) {
          await fs.promises.rename(file, file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`]));
        }
      }
    }
  }
  return res;
};
const format = async props => {
  const { directory } = props;
  const dir = directory || process.cwd();
  const files = getFiles(dir);
  // handle formatting video name
  await handleVideoRenaming(files);
  // handle getting formatted video name hash
  const renamedFiles = getFiles(dir);
  const fileNamesHash = await getVideoNamingHash(renamedFiles);
  console.log(fileNamesHash);
  // handle rename srt file
  await handleSubRenaming(renamedFiles, fileNamesHash);
  console.log(renderMyLog('Formated Successfully!'));
};

module.exports = {
  formatVideoName,
  findNamingCase,
  getCaseXInfoObj,
  getCaseAbbrInfoObj,
  getCaseFullInfoObj,
  getSequenceInfo,
  handleVideoRenaming,
  getVideoNamingHash,
  handleSubRenaming,
  format,
};
