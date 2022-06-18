import { CronJob } from "cron";
import scraper from "./scraper";

export default function (): CronJob {
  const schedule = process.env.SCHEDULE || "0 0 */2 * * *";
  const timezone = process.env.TZ || "Europe/Amsterdam";

  console.log(`Cron schedule: ${schedule}`);

  return new CronJob({
    cronTime: schedule,
    onTick: scraper,
    runOnInit: true,
    start: true,
    timeZone: timezone,
  });
}
