const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const semver = require('semver');
const packageJSON = require('./package.json');

const version = semver.inc(packageJSON.version, 'minor', 'dev');
fs.writeFileSync('./package.json', JSON.stringify(Object.assign({}, packageJSON, { version }), null, '  '));
fs.copySync('./package.json', 'dist/package.json');
console.log(version);

// delete dist
// run prod
// copy package json in dist
// npm pack


// npm publish
