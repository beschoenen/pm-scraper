"use strict";

let fs = require('fs');
let Transmission = require('transmission');

const regexes = {
  "PM": /^\[PM]Pocket_Monsters_(.{2,})_([0-9]{2,})_([^\[]+)\[.+]\[[0-9A-F]{8}]\..{3}$/,
  "Some-Stuffs": /^\[Some-Stuffs]_Pocket_Monsters_(.+)_([0-9]+)_(\[v([0-9])])?\[[0-9A-F]{8}]\..{3}$/,
};

///////////
// Settings

function getEnvSettings () {
  return {
    transmission: {
      host: process.env.TRANSMISSION_HOST,
      port: parseInt(process.env.TRANSMISSION_PORT),
      username: process.env.TRANSMISSION_USERNAME,
      password: process.env.TRANSMISSION_PASSWORD
    },
    downloadFolder: process.env.DOWNLOAD_FOLDER
  }
}

function getSettings () {
  if (!fs.existsSync(`${__dirname}/../config/settings.json`)) {
    console.log("Getting settings from ENV");
    return getEnvSettings();
  }

  return JSON.parse(fs.readFileSync(`${__dirname}/../config/settings.json`, 'utf8'));
}

////////////
// Timestamp

function getTimestamp () {
  return Math.round((new Date()).getTime() / 1000);
}

function writeTimestamp (date) {
  date = date || getTimestamp();

  console.log(`Writing timestamp: ${date}`);
  fs.writeFileSync(`${__dirname}/../config/timestamp`, date);
}

function readTimestamp () {
  if (!fs.existsSync(`${__dirname}/../config/timestamp`)) {
    return getTimestamp();
  }

  return parseInt(fs.readFileSync(`${__dirname}/../config/timestamp`));
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
      const season = getSeason(result[1]);
      const episode = pad(result[2], 3);

      if (season < 1) continue;

      item.newName = `[${group}] Pokemon S${season}E${episode}.mkv`;

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

      transmission.addUrl(item.links.file, { 'download-dir': settings.downloadFolder }, error => {
        if (error) return reject(error);

        console.log(`Added ${item.name}`);

        transmission.rename(data.id, data.name, item.newName, error => {
          if (error) return reject(error);

          console.log(`Renamed to ${item.newName}`);
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
