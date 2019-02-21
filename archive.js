const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream(__dirname + '/archives/package.zip');
output.on('close', function() {
  console.log('Data has been drained');
});

const archive = archiver('zip');
archive.pipe(output);
archive.directory('dist/', false);
archive.finalize();
