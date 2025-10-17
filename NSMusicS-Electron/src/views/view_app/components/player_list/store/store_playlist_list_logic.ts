import { reactive } from 'vue'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { store_player_audio_info } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { Get_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_PlaylistInfo'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'

export const store_playlist_list_logic = reactive({
  async reset_data() {
    usePlaylistStore().playlist_names_ALLLists = []
    usePlaylistStore().playlist_tracks_temporary_of_ALLLists = []
    if (store_server_user_model.model_select === 'server') {
      await store_general_model_player_list.get_playlists_info()
    } else {
      try {
        const get_PlaylistInfo_From_LocalSqlite = new Get_LocalSqlite_PlaylistInfo()
        const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
        playlist_temporary.forEach((item: Play_List) => {
          usePlaylistStore().playlist_names_ALLLists.push({
            label: item.name,
            value: item.id,
          })
          usePlaylistStore().playlist_tracks_temporary_of_ALLLists.push({
            playlist: item,
            playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id),
          })
        })
      } catch (e) {
        console.error(e)
      }
    }
  },

  playlist_names_StartUpdate: false,
  media_page_handleItemDbClick: false,

  async handleItemDbClick(media_file: any, index: number) {
    if (store_server_user_model.model_server_type_of_web) {
      /// Data synchronization
      usePlaylistStore().playlist_MediaFiles_temporary.forEach((row) => {
        const existingIndex = store_view_media_page_info.media_Files_temporary.findIndex(
          (item) => item.id === row.id
        )
        if (existingIndex === -1) {
          const newRow = { ...row }
          delete newRow.play_id
          store_view_media_page_info.media_Files_temporary.push(newRow)
        }
      })
    }
    await store_player_audio_logic.update_current_media_info(media_file, index)
    usePlaylistStore().media_page_handleItemDbClick = false
    store_player_audio_info.this_audio_restart_play = true
  },
})
