import { reactive } from 'vue'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_app_configs_logic_save } from '@/data/data_stores/app/store_app_configs_logic_save'
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { store_view_media_cue_page_info } from '@/views/view_app/music_page/page_media_cue/store/store_view_media_cue_page_info'

export const store_general_fetch_player_list = reactive({
  async fetchData_PlayList(cue_model: boolean) {
    store_playlist_list_info.playlist_MediaFiles_temporary = [];
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
      store_app_configs_logic_save.save_system_playlist_item_id_config()
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
  },

  _totalCount: 0,

  _start: 0,
  _end: 30,

  _album_id: '',
  _artist_id: '',
  _album_artist_id: '', // Emby Home$Album
})
