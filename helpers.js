"use strict";

let http = require('http');
let fs = require('fs');
let cheerio = require('cheerio');
let Transmission = require('transmission');

const regex = /^\[PM]Pocket_Monsters_(.+)_([0-9]{3})_([^\[]+)/;

///////////
// Download

function download(url) {
  let content = "";

  return new Promise((resolve, reject) => {
    http.get(url, response => {
      response.on('data', chunk => content += chunk);
      response.on('end', () => resolve(cheerio.load(content)));
      response.on('error', reject);
    })
  });
}

///////////
// Settings

function getSettings() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${__dirname}/settings.json`)) {
      return reject('Please create a settings file first.');
    }

    fs.readFile(`${__dirname}/settings.json`, 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data));
    });
  });
}

////////
// Cache

function readCache() {
  return new Promise(resolve => {
    if (!fs.existsSync(`${__dirname}/cache.json`)) {
      return resolve({});
    }

    fs.readFile(`${__dirname}/cache.json`, 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data) || {});
    });
  });
}

function writeCache(text) {
  fs.writeFileSync(`${__dirname}/cache.json`, text);
}

//////////
// Helpers

function pad(str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function getSeason(season) {
  switch (season) {
    case 'Sun_&_Moon':
      return 18;
    default:
      return 0;
  }
}

///////////////
// Transmission

function addToTransmission(items) {
  return new Promise((resolve, reject) => {
    getSettings().then(settings => {
      const transmission = new Transmission(settings.transmission);

      for (let key in items) {
        if (!items.hasOwnProperty(key)) continue;

        let item = items[key];

        if (!decodeURIComponent(item).match(regex)) continue;

        transmission.addUrl(`http://pocketmonsters.edwardk.info/${item}`, {
          'download-dir': settings.downloadFolder
        }, (error, data) => {
          if (error) return reject(error);

          renameTorrent(transmission, data)
        });
      }

      resolve();
    }).catch(console.error);
  });
}

function renameTorrent(transmission, torrent) {
  const results = torrent.name.match(regex);

  const season = getSeason(results[1]);
  const name = `[PM] Pokemon S${season}E${pad(results[2], 2)} [720p].mkv`;

  transmission.rename(torrent.id, torrent.name, name, () => console.log(`Added ${name}`));
}

module.exports = {
  download: download,
  cache: {
    read: readCache,
    write: writeCache
  },
  transmission: {
    add: addToTransmission,
    rename: renameTorrent
  }
};
