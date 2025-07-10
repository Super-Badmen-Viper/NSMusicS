import { Jellyfin_Api_Services_Web } from '../Jellyfin_Api_Services_Web'
import axios from 'axios'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server/store_server_users'

export class Audio_ApiService_of_Je extends Jellyfin_Api_Services_Web {
  /**
   * 获取音频流
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_steam_id(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/stream`)
  }

  /**
   * 获取指定容器格式的音频流
   * @param itemId 音频项 ID
   * @param container 容器格式（如 mp3、aac）
   * @returns 响应数据
   */
  public async getAudio_steam_container_id(itemId: string, container: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/stream.${container}`)
  }

  /**
   * 获取主播放列表（main.m3u8）
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_main_m3u8_id(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/main.m3u8`)
  }
  /**
   * 获取主播放列表（master.m3u8）
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_master_m3u8_id(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/master.m3u8`)
  }

  /**
   * 获取指定片段的 AAC 音频流
   * @param itemId 音频项 ID
   * @param segmentId 片段 ID
   * @returns 响应数据
   */
  public async getAudio_hsl_acc_id(itemId: string, segmentId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/hls/${segmentId}/stream.aac`)
  }
  /**
   * 获取指定片段的 MP3 音频流
   * @param itemId 音频项 ID
   * @param segmentId 片段 ID
   * @returns 响应数据
   */
  public async getAudio_hsl_mp3_id(itemId: string, segmentId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/hls/${segmentId}/stream.mp3`)
  }
  /**
   * 获取指定播放列表和片段的音频流
   * @param itemId 音频项 ID
   * @param playlistId 播放列表 ID
   * @param segmentId 片段 ID
   * @param container 容器格式（如 ts、mp4）
   * @returns 响应数据
   */
  public async getAudio_hsl1_id(
    itemId: string,
    playlistId: string,
    segmentId: string,
    container: string
  ): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/hls1/${playlistId}/${segmentId}.${container}`)
  }

  /**
   * 获取音频歌词
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_lyrics_id_of_Je(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/Lyrics`)
  }
  public async getAudio_lyrics_id_of_Em(itemId: string): Promise<any> {
    const response_PresentationUniqueKey = await axios(
      store_server_users.server_config_of_current_user_of_sqlite?.url +
        '/emby/Users/' +
        store_server_user_model.userid_of_Je +
        '/Items/' +
        itemId +
        '?fields=ShareLevel&ExcludeFields=VideoChapters%2CVideoMediaSources%2CMediaStreams&' +
        'api_key=' +
        store_server_user_model.authorization_of_Je
    )
    return {
      Lyrics: this.getFirstLyricsExtradata(response_PresentationUniqueKey.data),
    }
    // const response_lyric = await axios(
    //     store_server_users.server_config_of_current_user_of_sqlite?.url + '/emby/Items/' +
    //     itemId + '/' + response_PresentationUniqueKey.data.PresentationUniqueKey +
    //     '/Subtitles/2/Stream.js?api_key=' + store_server_user_model.authorization_of_Je
    // );
    // return {
    //     Lyrics: response_lyric.data.TrackEvents
    // }
  }
  private getFirstLyricsExtradata(response_PresentationUniqueKey: any): string | null {
    if (!response_PresentationUniqueKey.MediaStreams) {
      return null
    }
    for (const stream of response_PresentationUniqueKey.MediaStreams) {
      if (stream.Extradata) {
        return stream.Extradata
      }
    }
    return null
  }

  /**
   * 上传音频歌词
   * @param itemId 音频项 ID
   * @param fileName 歌词文件名
   * @returns 响应数据
   */
  public async postAudio_lyrics_id(itemId: string, fileName: string): Promise<any> {
    return this.sendRequest('POST', `Audio/${itemId}/Lyrics`, { fileName })
  }
  /**
   * 删除音频歌词
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async deleteAudio_lyrics_id(itemId: string): Promise<any> {
    return this.sendRequest('DELETE', `Audio/${itemId}/Lyrics`)
  }

  /**
   * 远程搜索音频歌词
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_remote_search_lyrics_id(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/RemoteSearch/Lyrics`)
  }
  /**
   * 提交远程搜索的音频歌词
   * @param itemId 音频项 ID
   * @param lyricId 歌词 ID
   * @returns 响应数据
   */
  public async postAudio_remote_search_lyrics_id(itemId: string, lyricId: string): Promise<any> {
    return this.sendRequest('POST', `Audio/${itemId}/RemoteSearch/Lyrics/${lyricId}`)
  }

  /**
   * 获取通用音频信息
   * @param itemId 音频项 ID
   * @returns 响应数据
   */
  public async getAudio_universal_id(itemId: string): Promise<any> {
    return this.sendRequest('GET', `Audio/${itemId}/universal`)
  }
}
