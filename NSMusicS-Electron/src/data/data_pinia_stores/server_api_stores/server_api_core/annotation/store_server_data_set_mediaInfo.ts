import { defineStore } from 'pinia'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useServerDataSetPlaylistInfoStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/annotation/store_server_data_set_playlistInfo'
import { Media_Annotation_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/media_annotation/index_service'
import { Playlists_ApiService_of_ND } from '@/data/data_configs/navidrome_api/services_normal/playlists/index_service'
import { UserPlayedItems_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/UserPlayedItems/index_service'
import { UserFavoriteItems_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/UserFavoriteItems/index_service'
import { Playlists_ApiService_of_Je } from '@/data/data_configs/jellyfin_api/services_web/Playlists/index_service'
import { Annotation_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service'
import { Playlist_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Scene/Music/Playlist/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export const useServerDataSetMediaInfoStore = defineStore('serverDataSetMediaInfo', () => {
  // 获取其他store
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()
  const serverDataSetPlaylistInfoStore = useServerDataSetPlaylistInfoStore()

  /**
   * 设置媒体文件为收藏/取消收藏
   */
  async function Set_MediaInfo_To_Favorite_Server(item_id: string, value: boolean) {
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
          item_id,
          '',
          ''
        )
      } else {
        await new Media_Annotation_ApiService_of_ND(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
        ).set_unstar(
          serverUserModelStore.username,
          serverUserModelStore.token,
          serverUserModelStore.salt,
          item_id,
          '',
          ''
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
            'media'
          )
        } else {
          await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setUnStar(
            item_id,
            'media'
          )
        }
      }
    }
  }

  /**
   * 设置媒体文件评分
   */
  async function Set_MediaInfo_To_Rating_Server(item_id: any, value: number) {
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
        'media',
        String(value)
      )
    }
  }

  /**
   * 设置媒体文件播放次数
   */
  async function Set_MediaInfo_To_PlayCount_of_Media_File_Server(item_id: any) {
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
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url).setScrobble(
          item_id,
          'media'
        )
      } else {
        const date = new Date(new Date().getTime() - 8 * 60 * 60 * 1000)
        if (serverUsersStore.server_select_kind === 'jellyfin') {
          const formattedDate = date
            .toISOString()
            .replace(/\.\d{3}Z$/, '.' + String(new Date().getMilliseconds()).padEnd(7, '0') + 'Z')
            .replace(/%3A/g, ':')
          await new UserPlayedItems_ApiService_of_Je(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url
          ).getUserPlayedItems_Quick(serverUserModelStore.userid_of_Je, item_id, formattedDate)
        } else if (serverUsersStore.server_select_kind === 'emby') {
          const formattedDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
          await new UserPlayedItems_ApiService_of_Je(
            serverUsersStore.server_config_of_current_user_of_sqlite?.url
          ).getUserPlayedItems_Quick(serverUserModelStore.userid_of_Je, item_id, formattedDate)
        }
      }
    }
  }

  /**
   * 设置媒体文件播放完成次数
   */
  async function Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server(item_id: any) {
    if (serverUserModelStore.model_server_type_of_web) {
      if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Annotation_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).setScrobbleComplete(item_id, 'media')
      }
    }
  }

  /**
   * 添加媒体文件到播放列表
   */
  async function Set_MediaInfo_Add_Selected_Playlist_Server(media_file_id: any, playlist_id: any) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).updatePlaylist_songIdToAdd(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        playlist_id,
        media_file_id
      )
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).postPlaylists_Add(playlist_id, media_file_id, serverUserModelStore.userid_of_Je)
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).addMediaFiles_Playlist(playlist_id, media_file_id)
      }
    }
  }

  /**
   * 从播放列表中删除媒体文件
   */
  async function Set_MediaInfo_Delete_Selected_Playlist_Server(media_file_id: any, playlist_id: any) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      const index = await serverDataSetPlaylistInfoStore.Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(
        playlist_id,
        [media_file_id]
      )
      await new Playlists_ApiService_of_ND(
        serverUsersStore.server_config_of_current_user_of_sqlite?.url + '/rest'
      ).updatePlaylist_songIndexToRemove(
        serverUserModelStore.username,
        serverUserModelStore.token,
        serverUserModelStore.salt,
        playlist_id,
        index[0]
      )
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby'
      ) {
        await new Playlists_ApiService_of_Je(
          serverUsersStore.server_config_of_current_user_of_sqlite?.url
        ).delPlaylists_Remove(playlist_id, media_file_id)
      } else if (serverUsersStore.server_select_kind === 'ninesong') {
        await new Playlist_ApiService_of_NineSong(
          store_server_login_info.server_url
        ).removeMediaFiles_Playlist(playlist_id, media_file_id)
      }
    }
  }

  // 暴露方法
  return {
    Set_MediaInfo_To_Favorite_Server,
    Set_MediaInfo_To_Rating_Server,
    Set_MediaInfo_To_PlayCount_of_Media_File_Server,
    Set_MediaInfo_To_PlayCompleteCount_of_Media_File_Server,
    Set_MediaInfo_Add_Selected_Playlist_Server,
    Set_MediaInfo_Delete_Selected_Playlist_Server
  }
})