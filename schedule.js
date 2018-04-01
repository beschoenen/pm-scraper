const cron = require('cron');
const scraper = require('./scraper');

const schedule = process.env.PM_SCHEDULE || '0 0 */2 * * *';

console.log(`Cron schedule: ${schedule}`);

new cron.CronJob({
  cronTime: schedule,
  onTick: scraper,
  start: true,
  runOnInit: true,
  timeZone: 'Europe/Amsterdam'
});
