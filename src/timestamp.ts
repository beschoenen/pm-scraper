import { existsSync, readFileSync, writeFileSync } from "fs";

export function writeTimestamp(date?: number): void {
  date = date || getTimestamp();

  writeFileSync(getTimestampPath(), date);
}

export function readTimestamp(): number {
  if (!existsSync(getTimestampPath())) {
    return getTimestamp();
  }

  const content = readFileSync(getTimestampPath(), "utf8");

  return parseInt(content, 10);
}

function getTimestampPath() {
  return `${__dirname}/../timestamp`;
}

function getTimestamp(): number {
  return Math.round((new Date()).getTime() / 1000);
}
