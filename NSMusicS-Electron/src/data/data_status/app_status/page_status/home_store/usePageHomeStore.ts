import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import error_album from '@/assets/img/error_album.jpg'
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'

// 定义专辑类型接口
interface AlbumType {
  medium_image_url?: string
}

export const usePageHomeStore = defineStore('pageHome', () => {
  // 状态定义（从 store_view_home_page_info.ts 合并）
  const home_Files_temporary_maximum_playback = ref<any[]>([])
  const home_Files_temporary_random_search = ref<any[]>([])
  const home_Files_temporary_recently_added = ref<any[]>([])
  const home_Files_temporary_recently_played = ref<any[]>([])
  const home_Files_temporary_type_select = ref('media')
  const home_selected_top_album_subscript = ref(0)
  const home_selected_top_album = ref<AlbumType | null>(null)
  const home_selected_top_album_medium_image_url = ref(error_album)

  // 逻辑状态（从 store_view_home_page_logic.ts 合并）
  const list_data_StartUpdate = ref(false)

  // 监听逻辑（从 store_view_home_page_info.ts 合并）
  watch(
    home_selected_top_album,
    (newValue) => {
      if (newValue && home_selected_top_album.value != undefined) {
        if (home_selected_top_album.value.medium_image_url){
            home_selected_top_album_medium_image_url.value = home_selected_top_album.value.medium_image_url
        } else {
            home_selected_top_album_medium_image_url.value = error_album
        }
      } else {
        home_selected_top_album_medium_image_url.value = error_album
      }
    }
  )

  // 监听逻辑（从 store_view_home_page_logic.ts 合并）
  watch(
    list_data_StartUpdate,
    (newValue) => {
      if (newValue) {
        store_general_fetch_home_list.fetchData_Home()
        store_view_media_page_logic.list_selected_Hand_click = true
        console.log('store_view_home_page_logic.list_data_StartUpdate')
        
        list_data_StartUpdate.value = false
      }
    }
  )

  // 返回状态和方法
  return {
    // 从 store_view_home_page_info.ts 返回的状态
    home_Files_temporary_maximum_playback,
    home_Files_temporary_random_search,
    home_Files_temporary_recently_added,
    home_Files_temporary_recently_played,
    home_Files_temporary_type_select,
    home_selected_top_album_subscript,
    home_selected_top_album,
    home_selected_top_album_medium_image_url,
    
    // 从 store_view_home_page_logic.ts 返回的状态
    list_data_StartUpdate
  }
})