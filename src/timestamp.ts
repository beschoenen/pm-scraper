import { existsSync, readFileSync, writeFileSync } from "fs";

const glob = global as Glob;

export function writeTimestamp(date?: number): void {
  date = date || getTimestamp();

  if (process.argv.indexOf("--in-memory") < 0) {
    writeFileSync(getTimestampPath(), date);
  } else {
    glob.timestamp = date;
  }
}

export function readTimestamp(): number {
  if (process.argv.indexOf("--in-memory") < 0) {
    return getFileTimestamp();
  } else {
    return glob.timestamp || getTimestamp();
  }
}

function getFileTimestamp(): number {
  if (!existsSync(getTimestampPath())) {
    return getTimestamp();
  }

  const content = readFileSync(getTimestampPath(), "utf8");

  return parseInt(content, 10);
}

function getTimestampPath(): string {
  return `${__dirname}/../timestamp`;
}

function getTimestamp(): number {
  return Math.round((new Date()).getTime() / 1000);
}
