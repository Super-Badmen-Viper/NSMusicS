import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { Media_Annotation_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/media_annotation/index_service'
import { UserFavoriteItems_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/UserFavoriteItems/index_service'
import { Annotation_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const useServerDataSetArtistInfoStore = defineStore('serverDataSetArtistInfo', () => {
  // 获取其他store
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()

  /**
   * 设置艺术家为收藏/取消收藏
   */
  async function Set_ArtistInfo_To_Favorite_Server(item_id: string, value: boolean) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      if (!value) {
        await new Media_Annotation_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).set_star(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          '',
          '',
          item_id
        )
      } else {
        await new Media_Annotation_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).set_unstar(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          '',
          '',
          item_id
        )
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        if (!value) {
          await new UserFavoriteItems_ApiService_of_Je(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url
          ).getUserFavoriteItems_Quick(serverUserModelStore.userid_of_Je, item_id)
        } else {
          await new UserFavoriteItems_ApiService_of_Je(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url
          ).delUserFavoriteItems_Quick(serverUserModelStore.userid_of_Je, item_id)
        }
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        if (!value) {
          await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setStar(
            item_id,
            'artist'
          )
        } else {
          await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setUnStar(
            item_id,
            'artist'
          )
        }
      }
    }
  }

  /**
   * 设置艺术家评分
   */
  async function Set_ArtistInfo_To_Rating_Server(item_id: any, value: number) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      await new Media_Annotation_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).set_rating(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        item_id,
        String(value)
      )
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setRating(
        item_id,
        'artist',
        String(value)
      )
    }
  }

  /**
   * 设置艺术家播放次数
   */
  async function Set_ArtistInfo_To_PlayCount_of_Artist_Server(item_id: any) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      await new Media_Annotation_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).set_scrobble(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        item_id,
        '',
        ''
      )
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setScrobble(
        item_id,
        'artist'
      )
    }
  }

  /**
   * 设置艺术家播放完成次数
   */
  async function Set_ArtistInfo_To_PlayCompleteCount_of_Artist_Server(item_id: any) {
    if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(
        store_server_login_info.server_url
      ).setScrobbleComplete(item_id, 'artist')
    }
  }

  // 暴露方法
  return {
    Set_ArtistInfo_To_Favorite_Server,
    Set_ArtistInfo_To_Rating_Server,
    Set_ArtistInfo_To_PlayCount_of_Artist_Server,
    Set_ArtistInfo_To_PlayCompleteCount_of_Artist_Server
  }
})