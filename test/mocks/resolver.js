const fs = require('fs');
const path = require('path');
const traverson = require('traverson');

function resolveFile(filePath, obj) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), 'utf-8', (err, file) => {
      if (err) {
        return reject(err);
      }
      return resolve([JSON.parse(file), obj || traverson.from('http://entrecode.de')]);
    });
  })
  .catch((err) => {
    throw new Error(`Cannot resolve mock ${filePath}: ${err.message}`);
  });
}

module.exports = resolveFile;
