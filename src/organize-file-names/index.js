const klawSync = require('klaw-sync');
const fs = require('fs');
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
const X_REGEX = /([0-9]{1}?)+[x]+([0-9]{1}?)+(([x]?)+([0-9]{1}?)?)+/gi;
const S_REGEX = /[s]+([0-9]{1}?)+/gi;
const E_REGEX = /[e]+([0-9]{0}?)+([0-9]{0}?)+([e]?)+([0-9]{1}?)+/gi;
const SEASON_REGEX = /season\.+([0-9]{1}?)+/gi;
const EPISODE_REGEX = /\.?episode\.+([0-9]{1}?)+([0-9]{0}?)+/gi;
const getSeasonEpisode = fileName => {
  // season episod regex
  // 1, S01E01
  // 2, 01x01
  const regexs = [/[s]+([0-9]{1}?)+[e]+([0-9]{1}?)+([e]?)+([0-9]{1}?)+/gi, /([0-9]{1}?)+[x]+([0-9]{1}?)+(([x]?)+([0-9]{1}?)?)+/gi];
  let matches;
  for (let i = 0; i < regexs.length; i += 1) {
    matches = fileName.match(regexs[i]);
    if (matches) {
      break;
    }
  }
  if (!matches) {
    throw new Error(`\n\n\n::::::::::::::::::::::::::::::::\n "${fileName}" does not have season and episods infomation. i.e. S01E01 or 01x01 \n::::::::::::::::::::::::::::::::\n\n`);
  }
  const match = matches[0];
  const seasonRegexs = [/[s]+([0-9]{1}?)+[e]+/gi, /([0-9]{1}?)+[x]/gi];
  let seasonMatches;
  for (let i = 0; i < seasonRegexs.length; i += 1) {
    seasonMatches = fileName.match(seasonRegexs[i]);
    if (seasonMatches) {
      break;
    }
  }
  if (!seasonMatches) {
    throw new Error(`\n\n\n::::::::::::::::::::::::::::::::\n "${fileName}" cannot find seanson info \n::::::::::::::::::::::::::::::::\n\n`);
  }
  const episode = match.replace(seasonMatches[0], '').replace(/e/gi, '');
  return [seasonMatches[0].replace(/s/gi, '').replace(/e/gi, '').replace(/x/gi, ''), episode];
};
const formatVideoName = f => {
  return f.split(' ').join('.').replace(/\.-\./g, '.').replace(/\.\./g, '.');
};
// x: 1x1 abbr: s01e01 full: Season 1 Episode 1
const CASES = ['x', 'abbr', 'full'];
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
module.exports = async props => {
  const { directory } = props;
  const files = getFiles(directory);
  const fileNamesHash = {};
  // handle formatting video name
  for (const file of files) {
    const [fileName, ext] = getFileName(file);
    if ([`.mkv`].includes(ext)) {
      let newFileName = formatVideoName(fileName);
      const sequenceInfo = getSequenceInfo(newFileName);
      const replacer = new RegExp(`(${sequenceInfo.matches.join(sequenceInfo.case === CASES[0] ? 'x' : '')})`, 'gi');
      newFileName = newFileName.replace(replacer, `${sequenceInfo.season}${sequenceInfo.episode}`.toUpperCase()).replace('bluray', 'BluRay');
      await fs.promises.rename(file, file.replace(fileName, newFileName));
    }
  }
  // handle getting formatted video name hash
  const filesAfterRenaming = getFiles(directory);
  for (const file of filesAfterRenaming) {
    const [fileName, ext] = getFileName(file);
    if ([`.mkv`].includes(ext)) {
      const sequenceInfo = getSequenceInfo(fileName);
      fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`] = fileName;
    }
  }
  console.log(fileNamesHash);
  // handle rename srt file
  for (const file of filesAfterRenaming) {
    const [fileName, ext] = getFileName(file);
    if (['.srt'].includes(ext)) {
      let newFileName = formatVideoName(fileName);
      const sequenceInfo = getSequenceInfo(newFileName);
      if (fileName.includes('中文') || fileName.includes('简体') || fileName.includes('chs')) {
        await fs.promises.rename(file, file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`] + '.中文字幕'));
      } else {
        if (!sequenceInfo.episode) {
          console.error('No episode, make sure the srt file name follows {showname}.S0?E0?');
          return;
        }
        await fs.promises.rename(file, file.replace(fileName, fileNamesHash[`${sequenceInfo.season}_${sequenceInfo.episode}`]));
      }
    }
  }
};
