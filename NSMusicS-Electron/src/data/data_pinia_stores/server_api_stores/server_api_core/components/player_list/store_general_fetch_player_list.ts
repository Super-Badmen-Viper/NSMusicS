import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_player_audio_info } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { store_view_media_cue_page_info } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_info'

/**
 * 播放器列表数据获取逻辑 store
 * 提供播放列表数据的获取和处理功能
 */
export const useGeneralFetchPlayerListStore = defineStore('generalFetchPlayerList', () => {
  // 状态定义
  const _totalCount = ref(0)
  const _start = ref(0)
  const _end = ref(30)
  const _album_id = ref('')
  const _artist_id = ref('')
  const _album_artist_id = ref('') // Emby Home$Album

  /**
   * 获取播放列表数据
   * @param cue_model 是否为cue模式
   */
  async function fetchData_PlayList(cue_model: boolean) {
    store_playlist_list_info.playlist_MediaFiles_temporary = []
    if (!cue_model) {
      store_playlist_list_info.playlist_MediaFiles_temporary =
        store_view_media_page_info.media_Files_temporary.map((row: any) => {
          row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
          return row
        })
      const media_file = store_playlist_list_info.playlist_MediaFiles_temporary.find(
        (row: any) => row.id === store_player_audio_info.this_audio_song_id
      )
      if (media_file) {
        store_player_audio_info.this_audio_play_id = media_file.play_id
      }
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
        store_view_media_page_info.media_Files_temporary.map((item: any) => item.id)
      store_system_configs_save.save_system_playlist_item_id_config()
    } else {
      store_playlist_list_info.playlist_MediaFiles_temporary =
        store_view_media_cue_page_info.media_Files_temporary.map((row: any) => {
          row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
          return row
        })
      const media_file = store_playlist_list_info.playlist_MediaFiles_temporary.find(
        (row: any) => row.id === store_player_audio_info.this_audio_song_id
      )
      if (media_file) {
        store_player_audio_info.this_audio_play_id = media_file.play_id
      }
    }
  }

  return {
    // 状态暴露
    _totalCount,
    _start,
    _end,
    _album_id,
    _artist_id,
    _album_artist_id,
    // 方法暴露
    fetchData_PlayList
  }
})