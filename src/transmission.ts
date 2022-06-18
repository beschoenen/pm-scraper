import * as TransmissionClient from "transmission";

let client: any;

export default class Transmission {

  private static get settings(): object {
    return {
      host: process.env.TRANSMISSION_HOST || "127.0.0.1",
      port: parseInt(process.env.TRANSMISSION_PORT || "9091", 10),
      username: process.env.TRANSMISSION_USERNAME,
      password: process.env.TRANSMISSION_PASSWORD,
    };
  }

  constructor() {
    if (!client) {
      client = new TransmissionClient(Transmission.settings);
    }
  }

  public addTorrent(url: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // client.addUrl(url, { "download-dir": process.env.DOWNLOAD_FOLDER }, (error: any, data: any) => {
      //   if (error) {
      //     return reject(error);
      //   }
      //
      //   resolve(data.id);
      // });
      resolve(1);
    });
  }

  public renameTorrent(id: number, oldName: string, newName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // client.rename(id, oldName, newName, (error: any, data: any) => {
      //   if (error) {
      //     return reject(error);
      //   }
      //
      //   resolve(data);
      // });
      resolve(1);
    });
  }

}
