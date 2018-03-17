"use strict";

let fs = require('fs');
let Transmission = require('transmission');

const regexes = {
  "PM": /^\[PM]Pocket_Monsters_(.{2,})_([0-9]{2,})_([^\[]+)\[.+]\[[0-9A-F]{8}]\..{3}$/,
  "Some-Stuffs": /^\[Some-Stuffs]_Pocket_Monsters_(.+)_([0-9]+)_(\[v([0-9])])?\[[0-9A-F]{8}]\..{3}$/,
};

///////////
// Settings

function getSettings () {
  if (!fs.existsSync(`${__dirname}/settings.json`)) {
    console.error('Please create a settings file first.');
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(`${__dirname}/settings.json`, 'utf8'));
}

////////////
// Timestamp

function writeTimestamp (date) {
  fs.writeFileSync(`${__dirname}/timestamp`, date || Math.round((new Date()).getTime() / 1000));
}

function readTimestamp () {
  if (!fs.existsSync(`${__dirname}/timestamp`)) {
    return Math.round((new Date()).getTime() / 1000);
  }

  return parseInt(fs.readFileSync(`${__dirname}/timestamp`));
}

//////////
// Helpers

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function getSeason (season) {
  switch (season) {
    case 'Sun_&_Moon':
      return 18;
    default:
      return 0;
  }
}

/////////////////
// Validity check

function isValidItem (item) {
  let lastRun = readTimestamp();

  if (parseInt(item.fileSize) < 100) return false;

  // Check if older than last run
  if (parseInt(item.timestamp) < lastRun) return false;

  for (let group in regexes) {
    let result = item.name.match(regexes[group]);

    if (result != null) {
      item.newName = `[${group}] Pokemon S${getSeason(result[1])}E${pad(result[2], 3)}.mkv`;

      return item;
    }
  }

  return false;
}

///////////////
// Transmission

function addToTransmission (items) {
  return new Promise((resolve, reject) => {
    if (items.length < 1) return resolve();

    let settings = getSettings();

    const transmission = new Transmission(settings.transmission);

    for (let key in items) {
      if (!items.hasOwnProperty(key)) continue;

      let item = items[key];

      transmission.addUrl(item.links.file, { 'download-dir': settings.downloadFolder }, (error, data) => {
        if (error) return reject(error);

        transmission.rename(data.id, data.name, item.newName, () => {
          console.log(`Added ${item.newName}`);
        });
      });
    }

    resolve();
  });
}

module.exports = {
  isValidItem: isValidItem,
  writeTimestamp: writeTimestamp,
  addToTransmission: addToTransmission
};
