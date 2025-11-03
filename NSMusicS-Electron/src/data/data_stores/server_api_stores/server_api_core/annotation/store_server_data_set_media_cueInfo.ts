import { reactive } from 'vue'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { Media_Annotation_ApiService_of_ND } from '@/server_api/navidrome_api/services_normal/media_annotation/index_service'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Playlists_ApiService_of_ND } from '@/server_api/navidrome_api/services_normal/playlists/index_service'
import { store_server_data_set_playlistInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_playlistInfo'
import { UserPlayedItems_ApiService_of_Je } from '@/server_api/jellyfin_api/services_web/UserPlayedItems/index_service'
import { UserFavoriteItems_ApiService_of_Je } from '@/server_api/jellyfin_api/services_web/UserFavoriteItems/index_service'
import { Playlists_ApiService_of_Je } from '@/server_api/jellyfin_api/services_web/Playlists/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { Annotation_ApiService_of_NineSong } from '@/server_api/ninesong_api/services_web/Scene/Music/Annotation/index_service'
import { Playlist_ApiService_of_NineSong } from '@/server_api/ninesong_api/services_web/Scene/Music/Playlist/index_service'

export const store_server_data_set_media_cueInfo = reactive({
  async Set_MediaInfo_To_Favorite_Server(item_id: string, value: boolean) {
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'ninesong') {
        if (!value) {
          await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setStar(
            item_id,
            'media_cue'
          )
        } else {
          await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setUnStar(
            item_id,
            'media_cue'
          )
        }
      }
    }
  },
  async Set_MediaInfo_To_Rating_Server(item_id: any, value: number) {
    if (
      store_server_user_model.model_server_type_of_web &&
      store_server_users.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setRating(
        item_id,
        'media_cue',
        String(value)
      )
    }
  },
  async Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id: any) {
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setScrobble(
          item_id,
          'media_cue'
        )
      }
    }
  },
  async Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server(item_id: any) {
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).setScrobbleComplete(item_id, 'media_cue')
      }
    }
  },
})
