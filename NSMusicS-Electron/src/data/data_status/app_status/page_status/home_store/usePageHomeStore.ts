import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
// 使用相对路径或更可靠的方式获取错误图片
const error_album = '/assets/img/error_album.jpg'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
// @ts-ignore - 忽略模块导入类型检查
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'

// 定义专辑类型接口
interface AlbumType {
  medium_image_url?: string
}

export const usePageHomeStore = defineStore('pageHome', () => {
  const home_Files_temporary_maximum_playback = ref<any[]>([])
  const home_Files_temporary_random_search = ref<any[]>([])
  const home_Files_temporary_recently_added = ref<any[]>([])
  const home_Files_temporary_recently_played = ref<any[]>([])
  const home_Files_temporary_type_select = ref('media')
  const home_selected_top_album_subscript = ref(0)
  const home_selected_top_album = ref<AlbumType | null>(null)
  const home_selected_top_album_medium_image_url = ref(error_album)

  const list_data_StartUpdate = ref(false)

  watch(home_selected_top_album, (newValue) => {
    if (newValue && home_selected_top_album.value != undefined) {
      if (home_selected_top_album.value.medium_image_url) {
        home_selected_top_album_medium_image_url.value =
          home_selected_top_album.value.medium_image_url
      } else {
        home_selected_top_album_medium_image_url.value = error_album
      }
    } else {
      home_selected_top_album_medium_image_url.value = error_album
    }
  })

  watch(list_data_StartUpdate, (newValue) => {
    if (newValue) {
      store_general_fetch_home_list.fetchData_Home()
      const pageMediaStore = usePageMediaStore()
      pageMediaStore.list_selected_Hand_click = true
      console.log('usePageHomeStore.list_data_StartUpdate')

      list_data_StartUpdate.value = false
    }
  })

  return {
    home_Files_temporary_maximum_playback,
    home_Files_temporary_random_search,
    home_Files_temporary_recently_added,
    home_Files_temporary_recently_played,
    home_Files_temporary_type_select,
    home_selected_top_album_subscript,
    home_selected_top_album,
    home_selected_top_album_medium_image_url,

    list_data_StartUpdate,
  }
})
