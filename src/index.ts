import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import schedule from "./schedule";
import scraper from "./scraper";

dotenvExpand.expand(dotenv.config());

if (process.argv.includes("--scheduled")) {
  schedule();
} else {
  scraper();
}
