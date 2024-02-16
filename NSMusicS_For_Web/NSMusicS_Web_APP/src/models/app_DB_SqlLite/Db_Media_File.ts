import sqlite3 from 'sqlite3';

export class Db_Media_File {
  private db: sqlite3.Database;
  private tableName: string;
  constructor(dbPath: string, tableName: string) {
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    this.tableName = tableName;
  }

  async readData(): Promise<Media_File[]> {
    return new Promise((resolve, reject) => {
      const data: Media_File[] = [];
      this.db.each(`SELECT * FROM ${this.tableName}`, (err, row: Media_File) => {
        if (err) {
          reject(err);
          return;
        }
        data.push(row);
      }, () => {
        this.db.close();
        resolve(data);
      });
    });
  }
  async readData_page(pageSize: number, pageNumber: number): Promise<Media_File[]> {
    const offset = pageSize * (pageNumber - 1);
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?`,
        [pageSize, offset],
        (err, rows: Media_File[]) => {
          if (err)
            reject(err);
          else 
            resolve(rows);
        }
      );
    });
  }

  async saveData(data: Media_File[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const values = data.map((item) => `('${item.id}', '${item.path}', '${item.title}' /* add other fields here */)`).join(',');

      this.db.run(`INSERT OR REPLACE INTO ${this.tableName} VALUES ${values}`, (err) => {
        if (err)
          reject(err);
        else 
          resolve();
      });
    });
  }
  async saveSingleData(item: Media_File): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
          `INSERT OR REPLACE INTO ${this.tableName} 
          VALUES (?, ?, ? /* add other fields here */)`, 
            [item.id, item.path, item.title /* add other values here */], 
      (err) => {
        if (err)
          reject(err);
        else 
          resolve();
      });
    });
  }

  closeConnection(): void {
    this.db.close();
  }
}