"use strict";

if (process.argv.indexOf('--scheduled') > 0) {
  require('./src/schedule')();
} else {
  require('./src/scraper')();
}
