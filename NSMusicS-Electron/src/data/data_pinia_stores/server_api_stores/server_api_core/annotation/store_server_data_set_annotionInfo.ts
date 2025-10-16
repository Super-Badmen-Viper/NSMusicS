import { defineStore } from 'pinia'
import { Media_Annotation_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/media_annotation/index_service'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { Annotation_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service'

export const useServerDataSetAnnotionInfoStore = defineStore('serverDataSetAnnotionInfo', () => {
  // 获取其他store
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()

  /**
   * 批量设置媒体收藏
   */
  async function Set_MediaInfo_Add_Selected_Favorite_Server(ids: string[], value: boolean) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      for (const id of ids) {
        await new Media_Annotation_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).set_star(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          id,
          '',
          ''
        )
      }
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setStar(
        ids.join(','),
        'media'
      )
    }
  }

  /**
   * 批量取消媒体收藏
   */
  async function Set_MediaInfo_Delete_Selected_Favorite_Server(ids: string[], value: boolean) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      for (const id of ids) {
        await new Media_Annotation_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).set_unstar(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          id,
          '',
          ''
        )
      }
    } else if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setUnStar(
        ids.join(','),
        'media'
      )
    }
  }

  // 暴露方法
  return {
    Set_MediaInfo_Add_Selected_Favorite_Server,
    Set_MediaInfo_Delete_Selected_Favorite_Server
  }
})