import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import schedule from "./src/schedule";
import scraper from "./src/scraper";

dotenvExpand(dotenv.config());

if (process.argv.indexOf("--scheduled") >= 0) {
  schedule();
} else {
  scraper();
}
