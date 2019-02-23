const fs = require('fs');
const archiver = require('archiver');

const config = require('../config.json');

function archive(buildDir, archiveDir, packageName) {
  console.log('Making archive...');

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir);
  }

  if (!fs.existsSync(buildDir)) {
    throw new Error('Build the game first!');
  }

  const output = fs.createWriteStream(`${__dirname}/../${archiveDir}/${packageName}.zip`);
  output.on('close', function() {
    console.log('Archive complete!');
  });

  const archive = archiver('zip');
  archive.pipe(output);
  archive.directory(`${buildDir}/`, false);
  archive.finalize();
}

archive(config.buildDirectory, config.archivesDirectory, config.packageName);

