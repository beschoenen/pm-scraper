import { readFileSync, writeFileSync, statSync, rmdirSync } from "fs";

const glob = global as any;
const timestampPath = process.env.TIMESTAMP_PATH || `${__dirname}/../timestamp`;

export function writeTimestamp(date?: number): void {
  date = date || getCurrentTimestamp();

  if (process.argv.includes("--in-memory")) {
    glob.timestamp = date;
  } else {
    if (statSync(timestampPath).isDirectory()) {
      rmdirSync(timestampPath);
    }

    writeFileSync(timestampPath, String(date));
  }
}

export function readTimestamp(): number {
  if (process.argv.includes("--in-memory")) {
    return glob.timestamp || getCurrentTimestamp();
  } else {
    return getFileTimestamp();
  }
}

function getFileTimestamp(): number {
  if (!statSync(timestampPath).isFile()) {
    return getCurrentTimestamp();
  }

  const content = readFileSync(timestampPath, "utf8");

  return parseInt(content, 10);
}

function getCurrentTimestamp(): number {
  return Math.round((new Date()).getTime() / 1000);
}
