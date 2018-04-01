const helpers = require('./helpers');
const { si } = require('nyaapi');

module.exports = () => {
  console.log(`Starting search at ${+new Date()}`);

  si.search({ term: "Pocket Monsters", n: 5, category: '1_2' }).catch(console.error).then(data => {
    console.log(`Found ${data.length} items`);

    let items = [];

    data.forEach(item => {
      let result = helpers.isValidItem(item);

      if (result === false) return;

      items.push(result);
    });

    console.log(`${items.length} of which are valid`);

    helpers.addToTransmission(items).then(helpers.writeTimestamp);
  });
};
