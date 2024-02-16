import path from "path";
import { Db_Media_File } from "./Db_Media_File";

export class Class_Media_File {
  static data: Media_File;
  static datas: Media_File[];
  constructor() {
    
  }
  static async readData() : Promise<Media_File[]> {
    const dbPath = path.resolve('../NSMusicS_Web_APP/src/resource/db_sqllite/navidrome.db');
    const tableName = 'media_file';
    const databaseHandler = new Db_Media_File(dbPath, tableName);
    try {
      this.datas = await databaseHandler.readData(); // Fetching 10 records from page 1
    } catch (error) {
      console.error('Error reading data:', error);
    } finally {
      databaseHandler.closeConnection();
    }
    return this.datas;
  }
  static async readData_page(pageSize: number, pageNumber: number) : Promise<Media_File[]> {
    const dbPath = path.resolve('../NSMusicS_Web_APP/src/resource/db_sqllite/navidrome.db');
    const tableName = 'media_file';
    const databaseHandler = new Db_Media_File(dbPath, tableName);
    try {
      this.datas = await databaseHandler.readData_page(pageSize, pageNumber);
    } catch (error) {
      console.error('Error reading data:', error);
    } finally {
      databaseHandler.closeConnection();
    }
    return this.datas;
  }
  static async saveData(newData: Media_File[]) {
    const dbPath = path.resolve('../NSMusicS_Web_APP/src/resource/db_sqllite/navidrome.db');
    const tableName = 'media_file';
    const databaseHandler = new Db_Media_File(dbPath, tableName);
    try {
      await databaseHandler.saveData(newData);
      console.log('Data saved successfully.');
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      databaseHandler.closeConnection();
    }
  }
  static async saveSingleData(newData: Media_File) {
    const dbPath = path.resolve('../NSMusicS_Web_APP/src/resource/db_sqllite/navidrome.db');
    const tableName = 'media_file';
    const databaseHandler = new Db_Media_File(dbPath, tableName);
    try {
      await databaseHandler.saveSingleData(newData);
      console.log('Single data saved successfully.');
    } catch (error) {
      console.error('Error saving single data:', error);
    } finally {
      databaseHandler.closeConnection();
    } 
  }
}

// const newData: Media_File = {
//   id: "",
//   path: "",
//   title: "",
//   album: "",
//   artist: "",
//   artist_id: "",
//   album_artist: "",
//   album_id: "",
//   has_cover_art: false,
//   track_number: 0,
//   disc_number: 0,
//   year: 0,
//   size: 0,
//   suffix: "",
//   duration: 0,
//   bit_rate: 0,
//   genre: "",
//   compilation: false,
//   full_text: "",
//   order_album_name: "",
//   order_album_artist_name: "",
//   order_artist_name: "",
//   sort_album_name: "",
//   sort_artist_name: "",
//   sort_album_artist_name: "",
//   sort_title: "",
//   disc_subtitle: "",
//   mbz_track_id: "",
//   mbz_album_id: "",
//   mbz_artist_id: "",
//   mbz_album_artist_id: "",
//   mbz_album_type: "",
//   mbz_album_comment: "",
//   catalog_num: "",
//   comment: "",
//   lyrics: "",
//   bpm: 0,
//   channels: 0,
//   order_title: "",
//   mbz_release_track_id: "",
//   rg_album_gain: 0,
//   rg_album_peak: 0,
//   rg_track_gain: 0,
//   rg_track_peak: 0
// };