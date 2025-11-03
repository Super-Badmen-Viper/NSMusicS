import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_general_fetch_artist_list } from '@/server/server_api_store/server_api_core/page/page_artist/store_general_fetch_artist_list'

export const usePageArtistStore = defineStore('pageArtist', () => {
  const artist_File_metadata = ref<any[]>([])
  const artist_Files_temporary = ref<any[]>([])
  const artist_page_sizes = ref<number>(15)
  const artist_item_count = ref<number>(0)
  const artist_starred_count = ref<number>(0)
  const artist_recently_count = ref<number>(0)

  const artist_Tree_Artist_info = ref<any>()
  const artist_Tree_Album_Tree_temporary = ref<any[]>([])

  const page_view_model = ref<string>('tree')

  const list_data_StartUpdate = ref<boolean>(false)
  const page_artistlists_options = ref<any[]>([])
  const page_artistlists_statistic = ref<any[]>([])
  const page_artistlists = ref<any[]>([])
  const page_artistlists_selected = ref<string>('artist_list_all')
  const page_artistlists_keyword_reset = ref<boolean>(false)
  const page_artistlists_keyword = ref<string>('')
  const page_artistlists_get_keyword_model_num = ref<number>(0)
  const page_artistlists_options_Sort_key = ref<any[]>([])
  const page_artistlists_multi_sort = ref<string>('')

  watch(page_artistlists_options_Sort_key, async (newValue) => {
    if (newValue != null) {
      page_artistlists_keyword.value = ''
      store_router_history_data_of_artist.fix_router_history_of_Artist_scroller_value(
        store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value
      ) // 保留此滚轮值(上次浏览位置)
      await store_general_fetch_artist_list.fetchData_Artist()
    }
  })

  watch(page_artistlists_keyword, async (newValue) => {
    page_artistlists_multi_sort.value = ''
    // 使用局部变量存储字符串值，避免重复访问 .value
    let keyword = page_artistlists_keyword.value
    if (keyword.indexOf('accurate_search') > 0) {
      keyword = keyword.replace('accurate_search', '')
      if (keyword.indexOf('__title__') > 0) {
        keyword = keyword.replace('__title__', '')
        page_artistlists_get_keyword_model_num.value = 1
      } else if (keyword.indexOf('__artist__') > 0) {
        keyword = keyword.replace('__artist__', '')
        page_artistlists_get_keyword_model_num.value = 2
      } else if (keyword.indexOf('__album__') > 0) {
        keyword = keyword.replace('__album__', '')
        page_artistlists_get_keyword_model_num.value = 3
      }
      // 更新原始值
      page_artistlists_keyword.value = keyword
    } else {
      page_artistlists_get_keyword_model_num.value = 0
    }
    page_artistlists_keyword_reset.value = true
    console.log('page_artistlists_keyword:' + page_artistlists_keyword.value)

    await store_general_fetch_artist_list.fetchData_Artist()
  })

  watch(page_artistlists_selected, async (newValue) => {
    console.log('page_artistlists_selected：' + newValue)
    await store_general_fetch_artist_list.fetchData_Artist()
  })

  watch(list_data_StartUpdate, async (newValue) => {
    if (newValue) {
      page_artistlists_keyword.value = ''
      await store_general_fetch_artist_list.fetchData_Artist()

      store_router_history_data_of_artist.router_history_datas_of_Artist = []
      if (store_router_history_data_of_artist.router_select_history_date_of_Artist) {
        store_router_history_data_of_artist.router_select_history_date_of_Artist.id = 1
        store_router_history_data_of_artist.router_history_datas_of_Artist.push(
          store_router_history_data_of_artist.router_select_history_date_of_Artist
        )
      }

      list_data_StartUpdate.value = false
      console.log('page_artistlists_reset_data?:' + newValue)
    }
  })

  watch(page_artistlists_multi_sort, (newValue) => {
    store_general_fetch_artist_list.fetchData_Artist_of_server_web_start()
  })

  return {
    artist_File_metadata,
    artist_Files_temporary,
    artist_page_sizes,
    artist_item_count,
    artist_starred_count,
    artist_recently_count,

    artist_Tree_Artist_info,
    artist_Tree_Album_Tree_temporary,

    page_view_model,

    list_data_StartUpdate,
    page_artistlists_options,
    page_artistlists_statistic,
    page_artistlists,
    page_artistlists_selected,
    page_artistlists_keyword_reset,
    page_artistlists_keyword,
    page_artistlists_get_keyword_model_num,
    page_artistlists_options_Sort_key,
    page_artistlists_multi_sort,
  }
})
