import { si } from "nyaapi";
import LocalItem from "./models/LocalItem";
import NyaaItem from "./models/NyaaItem";
import { isValidItem, newName } from "./parser";
import { writeTimestamp } from "./timestamp";
import Transmission from "./transmission";

export default async function (): Promise<any> {
  console.log("Starting search");

  try {
    const data = await si.search({term: "Pocket Monsters", n: 5, category: "1_2"});

    console.log(`Found ${data.length} items`);

    const items = filterItems(data);

    console.log(`${items.length} of which were valid`);

    await addToTransmission(items);

    writeTimestamp();
  } catch (e) {
    console.error(e);
  }
}

function filterItems(items: NyaaItem[]): LocalItem[] {
  const validItems = items.filter(isValidItem);

  const newObjects: LocalItem[] = validItems.map((item) => ({
    url: item.torrent,
    newName: newName(item),
    oldName: item.name,
  }));

  return newObjects.filter((item) => item.newName);
}

async function addToTransmission(items: LocalItem[]): Promise<any> {
  const transmission = new Transmission();

  for (const item of items) {
    const id = await transmission.addTorrent(item.url);

    console.log(`Added ${item.oldName}`);

    await transmission.renameTorrent(id, item.oldName, item.newName);

    console.log(`Renamed to ${item.newName}`);
  }
}
