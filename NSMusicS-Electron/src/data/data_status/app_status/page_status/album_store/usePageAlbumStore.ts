import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

export const usePageAlbumStore = defineStore('pageAlbum', () => {
  const album_File_metadata = ref<any[]>([])
  const album_Files_temporary = ref<any[]>([])
  const album_page_sizes = ref<number>(15)
  const album_item_count = ref<number>(0)
  const album_starred_count = ref<number>(0)
  const album_recently_count = ref<number>(0)

  const list_data_StartUpdate = ref<boolean>(false)
  const page_albumlists_options = ref<any[]>([])
  const page_albumlists_statistic = ref<any[]>([])
  const page_albumlists = ref<any[]>([])
  const page_albumlists_selected = ref<string>('album_list_all')
  const page_albumlists_keyword_reset = ref<boolean>(false)
  const page_albumlists_keyword = ref<string>('')
  const page_albumlists_get_keyword_model_num = ref<number>(0)
  const page_albumlists_options_Sort_key = ref<any[]>([])
  const page_albumlists_multi_sort = ref<string>('')
  const page_albumlists_input_search_Value = ref<string>('')
  const page_albumlists_filter_model = ref<boolean>(false)
  const page_albumlists_filter_year = ref<number>(0)

  watch(page_albumlists_options_Sort_key, async (newValue) => {
    if (newValue != null) {
      if (
        page_albumlists_options_Sort_key.value === undefined ||
        page_albumlists_options_Sort_key.value.length === 0
      ) {
        page_albumlists_keyword.value = ''
      }
      store_router_history_data_of_album.fix_router_history_of_Album_scroller_value(
        store_router_history_data_of_album.router_history_model_of_Album_scroller_value
      ) // 保留此滚轮值(上次浏览位置)
      await store_general_fetch_album_list.fetchData_Album()
    }
  })

  watch(page_albumlists_keyword, (newValue) => {
    page_albumlists_multi_sort.value = ''
    let search = page_albumlists_keyword.value
    if (search.indexOf('accurate_search') > 0) {
      search = search.replace('accurate_search', '')
      if (search.indexOf('__title__') > 0) {
        search = search.replace('__title__', '')
        page_albumlists_get_keyword_model_num.value = 1
      } else if (search.indexOf('__artist__') > 0) {
        search = search.replace('__artist__', '')
        page_albumlists_get_keyword_model_num.value = 2
      } else if (search.indexOf('__album__') > 0) {
        search = search.replace('__album__', '')
        page_albumlists_get_keyword_model_num.value = 3
      }
      store_router_data_info.find_album_model = true
    } else {
      page_albumlists_get_keyword_model_num.value = 0
    }
    page_albumlists_keyword_reset.value = true
    console.log('page_albumlists_keyword:' + newValue)

    store_general_fetch_album_list.fetchData_Album()
  })

  watch(page_albumlists_selected, (newValue) => {
    console.log('page_albumlists_selected：' + newValue)
    store_general_fetch_album_list.fetchData_Album()
  })

  watch(list_data_StartUpdate, (newValue) => {
    if (newValue) {
      page_albumlists_keyword.value = ''
      store_general_fetch_album_list.fetchData_Album()

      store_router_history_data_of_album.router_history_datas_of_Album = []
      if (store_router_history_data_of_album.router_select_history_date_of_Album) {
        store_router_history_data_of_album.router_select_history_date_of_Album.id = 1
        store_router_history_data_of_album.router_history_datas_of_Album.push(
          store_router_history_data_of_album.router_select_history_date_of_Album
        )
      }

      list_data_StartUpdate.value = false
      console.log('page_albumlists_reset_data?:' + newValue)
    }
  })

  watch(page_albumlists_filter_year, async (newValue) => {
    page_albumlists_filter_model.value = page_albumlists_filter_year.value !== 0
    store_system_configs_save.save_system_config_of_App_Configs()
    page_albumlists_keyword.value = ''
    await store_general_fetch_album_list.fetchData_Album()
  })

  watch(page_albumlists_multi_sort, async (newValue) => {
    store_general_fetch_album_list.fetchData_Album_of_server_web_start()
  })

  return {
    album_File_metadata,
    album_Files_temporary,
    album_page_sizes,
    album_item_count,
    album_starred_count,
    album_recently_count,

    list_data_StartUpdate,
    page_albumlists_options,
    page_albumlists_statistic,
    page_albumlists,
    page_albumlists_selected,
    page_albumlists_keyword_reset,
    page_albumlists_keyword,
    page_albumlists_get_keyword_model_num,
    page_albumlists_options_Sort_key,
    page_albumlists_multi_sort,
    page_albumlists_input_search_Value,
    page_albumlists_filter_model,
    page_albumlists_filter_year,
  }
})
