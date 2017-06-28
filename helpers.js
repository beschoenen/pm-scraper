"use strict"

let http = require('http');
let fs = require('fs');
let cheerio = require('cheerio');
let Transmission = require('transmission');

const regex = /^\[PM]Pocket_Monsters_([^0-9]+)_([0-9]+)_([^\[]+)/;

///////////
// Scraping

function get(url) {
  let content = "";

  return new Promise((resolve, reject) => {
    http.get(url, response => {
      response.on('data', chunk => content += chunk);
      response.on('end', () => resolve(cheerio.load(content)));
      response.on('error', reject);
    })
  });
}

function getSettings() {
  return new Promise(resolve => {
    fs.readFile('settings.json', 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data));
    });
  });
}

////////
// Cache

function createCacheIfNotExists() {
  if (!fs.existsSync('./cache.json')) {
    fs.closeSync(fs.openSync('./cache.json', 'w'));
    writeToCache('{}');
  }
}

function getCache() {
  return new Promise(resolve => {
    fs.readFile('cache.json', 'utf8', (error, data) => {
      if (error) throw error;

      resolve(JSON.parse(data));
    });
  });
}

function writeToCache(text) {
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
      const transmission = new Transmission({
        host: settings.transmission.host,
        port: settings.transmission.port,
        username: settings.transmission.username,
        password: settings.transmission.password,
      });

      for (let item in items) {
        if (!items.hasOwnProperty(item)) continue;

        transmission.addUrl(`http://pocketmonsters.edwardk.info/${items[item].link}`, {
          'download-dir': settings.download_folder
        }, (error, data) => {
          if (error) {
            return console.log(error);
          }

          renameTorrent(transmission, data)
        });
      }

      resolve();
    });
  });
}


function renameTorrent(transmission, torrent) {
  const results = torrent.name.match(regex);

  let season = getSeason(results[1]);
  let name = `[PM] Pokemon S${season}E${pad(results[2], 2)} [720p].mkv`;

  transmission.rename(torrent.id, torrent.name, name, () => console.log(`Added ${name}`));
}

module.exports = {
  get: get,
  pad: pad,
  createCacheIfNotExists: createCacheIfNotExists,
  writeToCache: writeToCache,
  getCache: getCache,
  addToTransmission: addToTransmission,
  getSeason: getSeason
};
