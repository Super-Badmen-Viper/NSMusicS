import { NineSong_Api_Services_Web } from '../../Scene/Music/NineSong_Api_Services_Web'

export class File_Entity_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async scanFile_Entity(
    folder_path: string,
    folder_type: number,
    scan_model: number
  ): Promise<any> {
    return this.sendRequest(
      'POST',
      'scan',
      {},
      {
        folder_path,
        folder_type,
        scan_model,
      }
    )
  }
  public async scanProgress(): Promise<any> {
    return this.sendRequest('GET', 'scan_progress', {}, {})
  }
}
