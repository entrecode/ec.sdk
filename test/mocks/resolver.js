const fs = require('fs');
const path = require('path');
const TraversonMock = require('./TraversonMock.js');

function resolveFile(filePath, obj, noArray) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), 'utf-8', (err, file) => {
      if (err) {
        return reject(err);
      }
      if (noArray) {
        return resolve(JSON.parse(file));
      }
      return resolve([JSON.parse(file), obj || new TraversonMock()]);
    });
  })
  .catch((err) => {
    throw new Error(`Cannot resolve mock ${filePath}: ${err.message}`);
  });
}

module.exports = resolveFile;
