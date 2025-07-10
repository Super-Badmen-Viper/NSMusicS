import { reactive, watch } from 'vue'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_media_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list'

export const store_router_history_data_of_media = reactive({
  router_history_model_of_Media_scroll: false,
  router_history_model_of_Media_scroller_value: 0,

  router_history_datas_of_Media: [] as Interface_View_Router_Date[],
  router_select_history_date_of_Media: null as Interface_View_Router_Date | null,
  router_history_model_of_Media: 0,

  async get_router_history_model_of_Media(value: number) {
    if (value === 0) return

    this.router_history_model_of_Media = value
    const currentIndex = this.router_history_datas_of_Media.findIndex(
      (item) => item.id === (this.router_select_history_date_of_Media?.id ?? '')
    )

    if (currentIndex === -1) return

    const newIndex = currentIndex + value
    if (newIndex < 0 || newIndex >= this.router_history_datas_of_Media.length) return

    this.fix_router_history_of_Media_scroller_value(
      this.router_history_model_of_Media_scroller_value
    ) // 保留此滚轮值(上次浏览位置)
    this.router_select_history_date_of_Media = this.router_history_datas_of_Media[newIndex]

    store_router_data_logic.clear_Files_temporary()

    const selectedRouterName = this.router_select_history_date_of_Media.router_name
    if (selectedRouterName === 'song') {
      store_router_data_info.router_select_model_media = true
      await store_general_fetch_media_list.fetchData_Media()
      this.router_history_model_of_Media_scroll = true
    }
  },

  add_router_history_of_Media(new_Router_date: Interface_View_Router_Date) {
    const existingIndex = this.router_history_datas_of_Media.findIndex(
      (item) =>
        item.stmt_string === new_Router_date.stmt_string &&
        item.page_lists_keyword === new_Router_date.page_lists_keyword &&
        item.page_songlists_keywordFilter === new_Router_date.page_songlists_keywordFilter &&
        item.page_lists_selected === new_Router_date.page_lists_selected &&
        item.columnKey === new_Router_date.columnKey &&
        item.order === new_Router_date.order
    )
    if (existingIndex !== -1) {
      new_Router_date.id = this.router_history_datas_of_Media[existingIndex].id
      this.router_history_datas_of_Media[existingIndex] = new_Router_date
      this.router_select_history_date_of_Media = new_Router_date
      return
    }
    if (this.router_history_datas_of_Media.length >= 36) {
      this.router_history_datas_of_Media.shift()
      updateHistoryIds(this.router_history_datas_of_Media)
    }
    new_Router_date.id = this.router_history_datas_of_Media.length + 1
    this.router_history_datas_of_Media.push(new_Router_date)
    this.router_select_history_date_of_Media = new_Router_date
  },

  remove_router_history_of_Media(id: number) {
    const index = this.router_history_datas_of_Media.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.router_history_datas_of_Media.splice(index + 1)
    }
  },

  fix_router_history_of_Media_scroller_value(value: number) {
    const index = this.router_history_datas_of_Media.findIndex(
      (item) => item.id === (this.router_select_history_date_of_Media?.id ?? '')
    )
    if (index !== -1) {
      this.router_history_datas_of_Media[index].page_lists_scrollindex = value
    }
  },
})
function updateHistoryIds(historyData: Interface_View_Router_Date[]) {
  historyData.forEach((item, index) => {
    item.id = index + 1
  })
}
watch(
  () => store_router_history_data_of_media.router_history_datas_of_Media,
  (newValue) => {
    updateHistoryIds(newValue)
  }
)
