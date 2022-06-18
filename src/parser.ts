import GroupRegex from "./models/GroupRegex";
import NyaaItem from "./models/NyaaItem";
import { readTimestamp } from "./timestamp";

const regexes: GroupRegex[] = [
  {
    name: "PM",
    regex: /^\[PM]Pocket_Monsters_(.{2,})_(\d{2,})_([^\[]+)\[H265.*_720P]\[[\dA-F]{8}]\..{3}$/,
  },
  {
    name: "Some-Stuffs",
    regex: /^\[Some-Stuffs]_Pocket_Monsters_(.+)_(\d+)_(?:\(\d{4}p\))?_?(?:v\d)?_?\[[\dA-F]{8}]\..{3}$/,
  },
];

function pad(str: string, max: number): string {
  return str.length < max ? pad("0" + str, max) : str;
}

function getSeason(season: string): number {
  switch (season) {
    case "Sun_&_Moon":
      return 18;
    case "(2019)":
      return 19;
    default:
      return 0;
  }
}

export function isValidItem(item: NyaaItem): boolean {
  console.log(`Checking validity of ${item.name}`);

  const lastRun = readTimestamp();

  if (parseInt(item.filesize, 10) < 100) {
    return false;
  }

  const date = new Date(item.date);
  const timestamp = date.getTime() / 1000;

  // Check if older than last run
  if (timestamp < lastRun) {
    console.log('Torrent was already checked');
    return false;
  }

  for (const group of regexes) {
    const result = item.name.match(group.regex);

    if (result != null) {
      const season = getSeason(result[1]);

      if (season < 1) {
        continue;
      }


      console.log('Torrent ok');

      return true;
    }
  }

  console.log('Torrent did not match any regex');

  return false;
}

export function newName(item: NyaaItem): string | null {
  for (const group of regexes) {
    const result = item.name.match(group.regex);

    if (result != null) {
      const season = getSeason(result[1]);
      const episode = pad(result[2], 3);

      if (season < 1) {
        continue;
      }

      return `[${group.name}] Pokemon S${season}E${episode}.mkv`;
    }
  }

  return null;
}
