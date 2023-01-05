const klawSync = require('klaw-sync');
const { exec } = require('child_process');
const R = require('ramda');
const getSerieFolder = pathName =>
  R.compose(
    R.filter(path => path.split('/').slice(-1)[0][0] !== '.'),
    R.map(item => item.path),
  )(klawSync(pathName, { nofile: true, depthLimit: 0 }));
const getSubFolder = pathName =>
  R.compose(
    R.filter(path => path.split('/').slice(-1)[0][0] !== '.'),
    R.map(item => item.path),
  )(klawSync(pathName, { nofile: true, depthLimit: 2 }));
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
const handleTransferFiles = async allEpisodesFolders => {
  for (const episodeFolder of allEpisodesFolders) {
    const episodeSubs = geFilesFromFolder(episodeFolder);
    if (episodeSubs[0]) {
      const serieName = episodeSubs[0].substring(episodeSubs[0].indexOf('Subs') + 'Subs/'.length, episodeSubs[0].lastIndexOf('/'));
      const serieFolder = episodeSubs[0].substring(0, episodeSubs[0].indexOf('Subs') - 1);
      for (const subFile of episodeSubs) {
        const subFileName = R.last(subFile.split('/'));
        if (subFileName[0] !== '.') {
          const matches = subFileName.match(/[0-9]+_+/gim);
          const numberPart = matches && matches.length ? `.${matches[0]}` : '.';
          const number = numberPart.replace(/_/g, '');
          const ext = getFileName(subFileName)[1];
          if (subFileName.toLowerCase().includes('chinese')) {
            const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
            const command = `mv '${subFile}' '${serieFolder}/${serieName}.${subFileName.replace(numberPartReg, '').replace(/chinese/gi, `中文字幕${number}`)}'`;
            await handleExec(command);
          } else if (subFileName.toLowerCase().includes('english') || subFileName.toLowerCase().includes('eng')) {
            const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
            const command = `mv '${subFile}' '${serieFolder}/${serieName}${subFileName.replace(numberPartReg, '').replace(/english/gi, `.English${number}`)}'`;
            await handleExec(command);
          } else {
            // const numberPartReg = new RegExp(numberPart.replace(/\./g, ''), 'gi');
            // const command = `mv '${subFile}' '${serieFolder}/${serieName}.${subFileName.replace(numberPartReg, '').replace(ext, `${number}${ext}`)}'`;
            // await handleExec(command);
          }
        }
      }
    }
  }
};
const moveSeriesSubs = async props => {
  const { directory } = props;
  const dir = directory || process.cwd();
  const serieFolders = getSerieFolder(dir);
  const folders = R.flatten(
    R.map(serieFolder =>
      R.flatten(
        R.map(folder =>
          R.compose(R.map(item => item.path))(
            klawSync(folder, {
              nofile: true,
              depthLimit: 1,
            }),
          ),
        )(getSubFolder(serieFolder)),
      ),
    )(serieFolders),
  );
  const allEpisodesFolders = R.uniq(R.filter(i => i.includes('/Subs') && R.last(i.split('/')) !== 'Subs')(folders));
  await handleTransferFiles(allEpisodesFolders);
  const subFolders = R.map(episodeFolder => `'${episodeFolder.substring(0, episodeFolder.indexOf('/Subs') + '/Subs'.length)}'`)(allEpisodesFolders);
  R.forEach(async episodeFolder => {
    const rmSubsFolderCommand = `rm -rf ${episodeFolder}`;
    await handleExec(rmSubsFolderCommand);
  })(R.uniq(subFolders));
};
module.exports = {
  moveSeriesSubs,
};
