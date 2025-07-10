import { reactive } from 'vue'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { Get_PlaylistInfo_From_LocalSqlite } from '@/data/data_access/local_configs/class_Get_PlaylistInfo_From_LocalSqlite'
import { store_general_model_player_list } from '@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_model_player_list'

export const store_playlist_list_logic = reactive({
  async reset_data() {
    store_playlist_list_info.playlist_names_ALLLists = []
    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
    if (store_server_user_model.model_select === 'server') {
      await store_general_model_player_list.get_playlists_info()
    } else {
      try {
        const get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
        const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
        playlist_temporary.forEach((item: Play_List) => {
          store_playlist_list_info.playlist_names_ALLLists.push({
            label: item.name,
            value: item.id,
          })
          store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
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
      store_playlist_list_info.playlist_MediaFiles_temporary.forEach((row) => {
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
    store_playlist_list_logic.media_page_handleItemDbClick = false
    store_player_audio_info.this_audio_restart_play = true
  },
})
