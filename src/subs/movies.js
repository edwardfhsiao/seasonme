const klawSync = require('klaw-sync');
const { exec } = require('child_process');
const R = require('ramda');
const { VIDEO_EXTS } = require('../consts/index.js');
const getMovieFolder = pathName =>
  R.compose(
    R.filter(path => path.split('/').slice(-1)[0][0] !== '.'),
    R.map(item => item.path),
  )(klawSync(pathName, { nofile: true, depthLimit: 0 }));
const getSubFolder = pathName =>
  R.compose(
    R.filter(path => path.split('/').slice(-1)[0][0] !== '.'),
    R.map(item => item.path),
  )(klawSync(pathName, { nofile: true, depthLimit: 0 }));
const geVideoFileName = pathName =>
  R.compose(R.map(item => item.path))(
    klawSync(pathName, {
      nodir: true,
      depthLimit: 0,
      filter: item => R.last(item.path.split('/'))[0] !== '.' && VIDEO_EXTS.includes(item.path.substring(item.path.lastIndexOf('.'), item.path.length)),
    }),
  );
const geFilesFromFolder = pathName =>
  R.compose(R.map(item => item.path))(
    klawSync(pathName, {
      nodir: true,
      depthLimit: 0,
    }),
  );

const handleExec = cmd =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
const getFileName = file => {
  const start = file.lastIndexOf('/') + 1;
  const end = file.lastIndexOf('.');
  const fileName = file.substring(start, end - start);
  const ext = file.substring(end, file.length);
  return [fileName, ext];
};
const moveMoviesSubs = async props => {
  const { directory } = props;
  const dir = directory || process.cwd();
  const movieFolders = getMovieFolder(dir);
  R.forEach(async movieFolder => {
    const subFolders = getSubFolder(movieFolder);
    const subs = R.find(i => i.includes('/Subs') && R.last(i.split('/')) === 'Subs')(subFolders);
    if (subs) {
      // console.log(movieFolder.substring(movieFolder.lastIndexOf('/') + 1, movieFolder.length));
      const res = geVideoFileName(movieFolder);
      if (res.length) {
        const moviePath = res[0];
        const movieName = moviePath.substring(moviePath.lastIndexOf('/') + 1, moviePath.lastIndexOf('.'));
        const subFiles = geFilesFromFolder(subs);
        for (const subFile of subFiles) {
          // console.log(subFile);
          // console.log(subs);
          const subFileName = R.replace(`${subs}/`, '', subFile);
          if (subFileName[0] !== '.') {
            const matches = subFileName.match(/[0-9]+_+/gim);
            // console.log(subFile, ' -- ', subFileName);
            const numberPart = matches && matches.length ? `.${matches[0]}` : '.';
            const number = numberPart.replace(/_/g, '');
            const ext = getFileName(subFileName)[1];
            if (subFileName.toLowerCase().includes('chinese')) {
              const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
              const command = `mv '${subFile}' '${movieFolder}/${movieName}.${subFileName.replace(numberPartReg, '').replace(/chinese/gi, `中文字幕${number}`)}'`;
              await handleExec(command);
            } else if (subFileName.toLowerCase().includes('english')) {
              const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
              const command = `mv '${subFile}' '${movieFolder}/${movieName}${subFileName.replace(numberPartReg, '').replace(/english/gi, `.English${number}`)}'`;
              // console.log(command);
              await handleExec(command);
            } else {
              const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
              const command = `mv '${subFile}' '${movieFolder}/${movieName}.${subFileName.replace(numberPartReg, '').replace(ext, `${number}${ext}`)}'`;
              await handleExec(command);
            }
          }
        }
        const rmSubsFolderCommand = `rm -rf '${subs}'`;
        await handleExec(rmSubsFolderCommand);
      }
    }
  })(movieFolders);
};
module.exports = {
  moveMoviesSubs,
};
