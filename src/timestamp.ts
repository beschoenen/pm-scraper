import { readFileSync, writeFileSync, statSync, rmdirSync } from "fs";

const glob = global as any;

export function writeTimestamp(date?: number): void {
  date = date || getTimestamp();

  if (process.argv.includes("--in-memory")) {
    glob.timestamp = date;
  } else {
    if (statSync(getTimestampPath()).isFile()) {
      rmdirSync(getTimestampPath());
    }

    writeFileSync(getTimestampPath(), String(date));
  }
}

export function readTimestamp(): number {
  if (process.argv.includes("--in-memory")) {
    return glob.timestamp || getTimestamp();
  } else {
    return getFileTimestamp();
  }
}

function getFileTimestamp(): number {
  if (!statSync(getTimestampPath()).isFile()) {
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
