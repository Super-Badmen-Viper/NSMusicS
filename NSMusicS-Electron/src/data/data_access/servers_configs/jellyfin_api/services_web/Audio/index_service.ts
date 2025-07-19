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
  public async getAudio_lyrics_id_of_Em(
    itemId: string,
    PresentationUniqueKey: string
  ): Promise<{ Lyrics: string | null }> {

    // 公共配置提取
    const baseUrl = store_server_users.server_config_of_current_user_of_sqlite?.url;
    const token = store_server_user_model.authorization_of_Je;
    const userId = store_server_user_model.userid_of_Je;

    // 请求1：获取媒体流信息
    let response1;
    try {
      response1 = await axios.get(
        `${baseUrl}/emby/Users/${userId}/Items/${itemId}`,
        {
          params: {
            fields: 'ShareLevel',
            ExcludeFields: 'VideoChapters,VideoMediaSources,MediaStreams',
            api_key: token
          }
        }
      );
    } catch (error) {
      console.error("首次请求失败:", error);
      return { Lyrics: null };
    }

    // 尝试解析歌词
    let result = this.getFirstLyricsExtradata(response1.data);
    if (result !== null) {
      return { Lyrics: result };
    }

    // 请求2：后备歌词请求
    try {
      // 修复1：动态获取PresentationUniqueKey
      if (PresentationUniqueKey === undefined) {
        const songUrl = `${baseUrl}/emby/Users/${store_server_user_model.userid_of_Je}/Items/${itemId}`;
        const params = {
          ExcludeFields: 'VideoChapters,VideoMediaSources,MediaStreams',
          'X-Emby-Client': 'Emby Web',
          'X-Emby-Token': token
        };

        // 请求歌曲元数据
        const songResponse = await axios.get(songUrl, { params });
        PresentationUniqueKey = songResponse.data.PresentationUniqueKey; // ✅ 提取关键字段

        // 修复2：验证值有效性
        if (!PresentationUniqueKey) {
          console.error("无法获取PresentationUniqueKey");
          return { Lyrics: null };
        }
      }

      const lyricUrl = `${baseUrl}/emby/Items/${itemId}/${PresentationUniqueKey}/Subtitles/2/Stream.js`;
      const response2 = await axios.get(lyricUrl, {
        headers: {
          Authorization: `MediaBrowser Token="${token}", Client="NSMusicS", Device="Desktop Client", DeviceId="NineSong", Version="1.7.1"`
        },
        timeout: 8000,
        responseType: 'json'
      });

      const lrcLyrics = this.convertTrackEventsToLRC(response2.data.TrackEvents);
      return { Lyrics: lrcLyrics };
    } catch (error) {
      console.error("歌词请求失败:", error);
      return { Lyrics: null };
    }
  }

  private getFirstLyricsExtradata(data: any): string | null {
    if (!data?.MediaStreams) return null;
    for (const stream of data.MediaStreams) {
      if (stream.Extradata) return stream.Extradata;
    }
    return null;
  }

  private convertTrackEventsToLRC(trackEvents: any[]): string {
    if (!trackEvents || !Array.isArray(trackEvents)) return '';

    return trackEvents
      .filter(event => event.StartPositionTicks != null && event.Text)
      .map(event => {
        // 将ticks转换为秒 (1秒 = 10,000,000 ticks)
        const totalSeconds = event.StartPositionTicks / 10000000;

        // 计算分钟、秒和百分秒
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const centiseconds = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 100);

        // 格式化为LRC时间标签 [mm:ss.xx]
        const timeTag = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;

        return `${timeTag}${event.Text}`;
      })
      .join('\n'); // 用换行符连接所有歌词行
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
