import { reactive } from 'vue'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'

import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { store_view_media_cue_page_info } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_info'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'

export const store_general_fetch_player_list = reactive({
  async fetchData_PlayList(cue_model: boolean) {
    const playerAudioStore = usePlayerAudioStore()
    const playlistStore = usePlaylistStore()

    playlistStore.playlist_MediaFiles_temporary = []
    if (!cue_model) {
      playlistStore.playlist_MediaFiles_temporary =
        store_view_media_page_info.media_Files_temporary.map((row: any) => {
          row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
          return row
        })
      const media_file = playlistStore.playlist_MediaFiles_temporary.find(
        (row: any) => row.id === playerAudioStore.this_audio_song_id
      )
      if (media_file) {
        playerAudioStore.this_audio_play_id = media_file.play_id
      }
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds =
        store_view_media_page_info.media_Files_temporary.map((item: any) => item.id)
      store_system_configs_save.save_system_playlist_item_id_config()
    } else {
      playlistStore.playlist_MediaFiles_temporary =
        store_view_media_cue_page_info.media_Files_temporary.map((row: any) => {
          row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
          return row
        })
      const media_file = playlistStore.playlist_MediaFiles_temporary.find(
        (row: any) => row.id === playerAudioStore.this_audio_song_id
      )
      if (media_file) {
        playerAudioStore.this_audio_play_id = media_file.play_id
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
