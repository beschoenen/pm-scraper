"use strict";

const helpers = require('./helpers');
const { si } = require('nyaapi');

si.search({ term: "Pocket Monsters", n: 5, category: '1_2' }).catch(console.error).then(data => {
  let items = [];

  data.forEach(item => {
    let result = helpers.isValidItem(item);

    if (result === false) return;

    items.push(result);
  });

  helpers.addToTransmission(items).then(helpers.writeTimestamp);
});
