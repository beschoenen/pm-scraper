let helpers = require('./helpers');
let md5 = require('md5');
let fs = require('fs');

// Search

helpers.get('http://pocketmonsters.edwardk.info').then($ => {
  let items = {};

  $('a#NewTorrents ~ table.main').find('tr a').each((index, item) => {
    const object = {
      text: decodeURI($(item).text()),
      link: decodeURI($(item).attr('href').toString())
    };

    items[md5(object.text)] = object;
  });

  checkNewItems(items);
});

function checkNewItems(items) {
  helpers.createCacheIfNotExists();

  let newItems = {};

  helpers.getCache().then(json => {
    for (let item in items) {
      if (!items.hasOwnProperty(item)) continue;

      if (!(item in json)) {
        newItems[item] = items[item];
      }
    }

    helpers.addToTransmission(newItems).then(() => {
      helpers.writeToCache(JSON.stringify(items));
    });
  });
}
