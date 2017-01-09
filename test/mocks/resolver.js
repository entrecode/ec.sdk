'use strict';

const fs = require('fs');
const path = require('path');

function resolveFile(filePath, obj) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), 'utf-8', (err, file) => {
      if (err) {
        return reject(err);
      }
      return resolve([JSON.parse(file), obj || {}]); // TODO traversal?
    });
  })
  .catch((err) => {
    throw new Error(`Cannot resolve mock ${filePath}: ${err.message}`);
  });
}

module.exports = resolveFile;
