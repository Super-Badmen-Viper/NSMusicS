import { reactive } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
// @ts-ignore - 忽略模块导入类型检查
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
// @ts-ignore - 忽略模块导入类型检查
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { usePageTagStore } from '@/data/data_status/app_status/page_status/tag_store/usePageTagStore'

// 定义页面类型枚举
type PageType =
  | 'home'
  | 'recently_added'
  | 'charts'
  | 'recommend'
  | 'tag'
  | 'media_cue'
  | 'media'
  | 'album'
  | 'artist'

export const store_router_data_logic = reactive({
  reset_data() {
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    const pageTagStore = usePageTagStore()
    ///
    pageMediaStore.page_songlists_keywordFilter = ''
    pageMediaStore.page_songlists_multi_sort = ''
    pageMediaStore.page_songlists_selected = 'song_list_all'
    pageAlbumStore.page_albumlists_keyword = ''
    pageAlbumStore.page_albumlists_selected = 'album_list_all'
    pageArtistStore.page_artistlists_keyword = ''
    pageArtistStore.page_artistlists_selected = 'artist_list_all'
    store_router_history_data_of_media.router_history_datas_of_Media = []
    store_router_history_data_of_album.router_history_datas_of_Album = []
    store_router_history_data_of_artist.router_history_datas_of_Artist = []
    store_router_history_data_of_media.router_select_history_date_of_Media = 'song_list_all'
    store_router_history_data_of_album.router_select_history_date_of_Album = 'album_list_all'
    store_router_history_data_of_artist.router_select_history_date_of_Artist = 'artist_list_all'
    ///
    pageTagStore.tag_metadata_find_model = false
    pageMediaStore.page_songlists_library_path = ''
    pageMediaStore.page_songlists_library_folder_path = ''
    ///
    pageTagStore.tag_LibraryItems_metadata = []
    pageTagStore.tag_LibraryItems_temporary = []
    ///
  },

  clear_Memory_Model: false,
  get_clear_Memory_Model(value: any) {
    this.clear_Memory_Model = value
    this.clear_Equilibrium_Model = value ? false : this.clear_Equilibrium_Model
    this.clear_UserExperience_Model = value ? false : true
    store_system_configs_save.save_system_config_of_App_Configs()
  },
  clear_Equilibrium_Model: false,
  get_clear_Equilibrium_Model(value: any) {
    this.clear_Equilibrium_Model = value
    this.clear_Memory_Model = value ? false : true
    this.clear_UserExperience_Model = value ? false : this.clear_UserExperience_Model
    store_system_configs_save.save_system_config_of_App_Configs()
  },
  clear_UserExperience_Model: true,
  get_clear_UserExperience_Model(value: any) {
    this.clear_UserExperience_Model = value
    this.clear_Memory_Model = value ? false : true
    this.clear_Equilibrium_Model = value ? false : this.clear_Equilibrium_Model
    store_system_configs_save.save_system_config_of_App_Configs()
  },

  /**
   * 清除所有页面的临时文件数据
   */
  clearAllTemporaryFiles() {
    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    const pageTagStore = usePageTagStore()

    // 清除首页临时数据
    pageHomeStore.home_Files_temporary_maximum_playback = []
    pageHomeStore.home_Files_temporary_random_search = []
    pageHomeStore.home_Files_temporary_recently_added = []
    pageHomeStore.home_Files_temporary_recently_played = []

    // 清除其他页面临时数据
    pageMediaStore.media_Files_temporary = []
    pageAlbumStore.album_Files_temporary = []
    pageArtistStore.artist_Files_temporary = []
    pageArtistStore.artist_Tree_Artist_info = undefined
    pageArtistStore.artist_Tree_Album_Tree_temporary = []

    // 清除其他页面临时数据
    pageTagStore.tag_metadata_find_model = false
    pageMediaStore.page_songlists_library_path = ''
    pageMediaStore.page_songlists_library_folder_path = ''
    ///
    pageTagStore.tag_LibraryItems_metadata = []
    pageTagStore.tag_LibraryItems_temporary = []

    //
    pageHomeStore.home_Files_temporary_recently_added_search = undefined
  },

  /**
   * 根据指定页面清除临时文件（保留该页面的数据）
   * @param pageToKeep 需要保留数据的页面
   */
  clearTemporaryFilesExcept(pageToKeep: PageType) {
    store_router_data_info.router_select = pageToKeep

    const pageHomeStore = usePageHomeStore()
    const pageMediaStore = usePageMediaStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    const pageTagStore = usePageTagStore()

    // 定义需要保留首页数据的页面
    const keepHomeData = pageToKeep === 'home'

    // 定义需要保留各页面数据的条件
    const keepMediaData = pageToKeep === 'media'
    const keepAlbumData = pageToKeep === 'album'
    const keepArtistData = pageToKeep === 'artist'

    const keepTagData = pageToKeep === 'tag'

    const keepRecentlyAddedData = pageToKeep === 'recently_added'

    // 清除首页数据（除非需要保留）
    if (!keepHomeData) {
      pageHomeStore.home_Files_temporary_maximum_playback = []
      pageHomeStore.home_Files_temporary_random_search = []
      pageHomeStore.home_Files_temporary_recently_added = []
      pageHomeStore.home_Files_temporary_recently_played = []
    }

    // 清除媒体页面数据（除非需要保留）
    if (!keepMediaData) {
      pageMediaStore.media_Files_temporary = []
    }

    // 清除专辑页面数据（除非需要保留）
    if (!keepAlbumData) {
      pageAlbumStore.album_Files_temporary = []
    }

    // 清除艺术家页面数据（除非需要保留）
    if (!keepArtistData) {
      pageArtistStore.artist_Files_temporary = []
      pageArtistStore.artist_Tree_Artist_info = undefined
      pageArtistStore.artist_Tree_Album_Tree_temporary = []
    }

    // 清除元数据页面临时数据
    if (!keepTagData) {
      pageTagStore.tag_metadata_find_model = false
      pageMediaStore.page_songlists_library_path = ''
      pageMediaStore.page_songlists_library_folder_path = ''
      ///
      pageTagStore.tag_LibraryItems_metadata = []
      pageTagStore.tag_LibraryItems_temporary = []
    }

    if (!keepRecentlyAddedData) {
      pageHomeStore.home_Files_temporary_recently_added_search = undefined
    }
  },

  get_media_list_of_album_id_by_album_info(value: any) {
    // @ts-ignore - 忽略router类型检查
    if (store_router_data_info.router && typeof store_router_data_info.router.push === 'function') {
      store_router_data_info.router.push('media')
    }
    const pageMediaStore = usePageMediaStore()
    if (store_server_user_model.model_server_type_of_local) {
      pageMediaStore.list_data_Hand_Search = true
      pageMediaStore.list_selected_Hand_click = false
      // open media_files model，keywords set
      pageMediaStore.page_songlists_keywordFilter = `WHERE album_id = '${value}'`
      pageMediaStore.page_songlists_get_keyword_model_num = 3
      store_router_data_info.find_music_model = true
      console.log('get_media_list_of_album_model：' + value)
      pageMediaStore.page_songlists_input_search_Value = value
    }
    pageMediaStore.page_songlists_selected = 'song_list_all'
  },
  get_album_list_of_artist_id_by_artist_info(value: any) {
    // @ts-ignore - 忽略router类型检查
    if (store_router_data_info.router && typeof store_router_data_info.router.push === 'function') {
      store_router_data_info.router.push('album')
    }
    store_router_data_info.find_album_model = true
    const pageAlbumStore = usePageAlbumStore()
    if (store_server_user_model.model_server_type_of_local) {
      pageAlbumStore.page_albumlists_keyword = value
    } else if (store_server_user_model.model_server_type_of_web) {
      pageAlbumStore.page_albumlists_keyword = ''
    }
    pageAlbumStore.page_albumlists_get_keyword_model_num = 2
    store_router_data_info.find_artist_model = false
    console.log('get_album_list_of_artist_model：' + value)
    pageAlbumStore.page_albumlists_input_search_Value = value
  },
})
