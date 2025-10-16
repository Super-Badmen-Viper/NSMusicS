import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { Annotation_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const useServerDataSetMediaCueInfoStore = defineStore('serverDataSetMediaCueInfo', () => {
  // 获取其他store
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()

  /**
   * 设置媒体片段为收藏/取消收藏
   */
  async function Set_MediaInfo_To_Favorite_Server(item_id: string, value: boolean) {
    if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
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
  }

  /**
   * 设置媒体片段评分
   */
  async function Set_MediaInfo_To_Rating_Server(item_id: any, value: number) {
    if (
      serverUserModelStore.model_server_type_of_web &&
      serverUsersStore.server_select_kind === 'ninesong'
    ) {
      await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setRating(
        item_id,
        'media_cue',
        String(value)
      )
    }
  }

  /**
   * 设置媒体片段播放次数
   */
  async function Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id: any) {
    if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setScrobble(
          item_id,
          'media_cue'
        )
      }
    }
  }

  /**
   * 设置媒体片段播放完成次数
   */
  async function Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server(item_id: any) {
    if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).setScrobbleComplete(item_id, 'media_cue')
      }
    }
  }

  // 暴露方法
  return {
    Set_MediaInfo_To_Favorite_Server,
    Set_MediaInfo_To_Rating_Server,
    Set_MediaInfo_To_PlayCount_of_Media_File_Server,
    Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server
  }
})