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
  return new Promise(resolve => {
    if (!fs.existsSync('settings.json')) {
      throw 'Please create a settings file first.';
    }

    fs.readFile('settings.json', 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data));
    });
  });
}

////////
// Cache

function readCache() {
  return new Promise(resolve => {
    if (!fs.existsSync('./cache.json')) {
      return resolve({});
    }

    fs.readFile('cache.json', 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data) || {});
    });
  });
}

function writeCache(text) {
  fs.writeFileSync('./cache.json', text);
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
  return new Promise(resolve => {
    getSettings().then(settings => {
      const transmission = new Transmission(settings.transmission);

      items.forEach(item => {
        if (!decodeURIComponent(item).match(regex)) return;

        transmission.addUrl(`http://pocketmonsters.edwardk.info/${item}`, {
          'download-dir': settings.downloadFolder
        }, (error, data) => {
          if (error) throw error;

          renameTorrent(transmission, data)
        });
      });

      resolve();
    });
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
