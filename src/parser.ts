import GroupRegex from "./models/GroupRegex";
import NyaaItem from "./models/NyaaItem";
import { readTimestamp } from "./timestamp";

const regexes: GroupRegex[] = [
  {
    name: "PM",
    regex: /^\[PM]Pocket_Monsters_(.{2,})_([0-9]{2,})_([^\[]+)\[.+]\[[0-9A-F]{8}]\..{3}$/,
  },
  {
    name: "Some-Stuffs",
    regex: /^\[Some-Stuffs]_Pocket_Monsters_(.+)_([0-9]+)_(\[v([0-9])])?\[[0-9A-F]{8}]\..{3}$/,
  },
];

function pad(str: string, max: number): string {
  return str.length < max ? pad("0" + str, max) : str;
}

function getSeason(season: string): number {
  switch (season) {
    case "Sun_&_Moon":
      return 18;
    default:
      return 0;
  }
}

export function isValidItem(item: NyaaItem): boolean {
  const lastRun = readTimestamp();

  if (parseInt(item.fileSize, 10) < 100) { return false; }

  // Check if older than last run
  if (parseInt(item.timestamp, 10) < lastRun) { return false; }

  for (const group of regexes) {
    const result = item.name.match(group.regex);

    if (result != null) {
      const season = getSeason(result[1]);

      if (season < 1) { continue; }

      return true;
    }
  }

  return false;
}

export function newName(item: NyaaItem): string | null {
  for (const group of regexes) {
    const result = item.name.match(group.regex);

    if (result != null) {
      const season = getSeason(result[1]);
      const episode = pad(result[2], 3);

      if (season < 1) { continue; }

      return `[${group.name}] Pokemon S${season}E${episode}.mkv`;
    }
  }

  return null;
}
