"use strict";

let helpers = require('./helpers');
let md5 = require('md5');
let fs = require('fs');

/////////
// Search

helpers.download('http://pocketmonsters.edwardk.info').then($ => {
  let items = {};

  $('a#NewTorrents ~ table.main').find('tr a').each((index, item) => {
    const link = $(item).attr('href').toString();

    items[md5(link)] = link;
  });

  checkNewItems(items);
});

function checkNewItems(items) {
  const newItems = {};

  helpers.cache.read().then(cache => {
    for (let item in items) {
      if (!items.hasOwnProperty(item)) continue;

      if (!(item in cache)) {
        newItems[item] = items[item];
      }
    }

    helpers.transmission.add(newItems).then(() => {
      helpers.cache.write(JSON.stringify(items));
    });
  });
}
