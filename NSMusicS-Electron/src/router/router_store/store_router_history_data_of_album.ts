import { reactive, watch } from 'vue'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'

export const store_router_history_data_of_album = reactive({
  router_history_model_of_Album_scroll: false,
  router_history_model_of_Album_scroller_value: 0,

  router_history_datas_of_Album: [] as Interface_View_Router_Date[],
  router_select_history_date_of_Album: null as Interface_View_Router_Date | null,
  router_history_model_of_Album: 0,

  get_router_history_model_of_Album(value: number) {
    if (value !== 0) {
      this.router_history_model_of_Album = value
      const currentIndex = this.router_history_datas_of_Album.findIndex(
        (item) => item.id === (this.router_select_history_date_of_Album?.id ?? '')
      )

      if (currentIndex !== -1) {
        const newIndex = currentIndex + value
        if (newIndex >= 0 && newIndex < this.router_history_datas_of_Album.length) {
          this.fix_router_history_of_Album_scroller_value(
            this.router_history_model_of_Album_scroller_value
          ) // 保留此滚轮值(上次浏览位置)
          this.router_select_history_date_of_Album = this.router_history_datas_of_Album[newIndex]
          store_router_data_logic.clearAllTemporaryFiles()
          const selectedRouterName = this.router_select_history_date_of_Album.router_name
          if (selectedRouterName === 'album') {
            store_router_data_info.router_select = 'album'
            store_general_fetch_album_list.fetchData_Album()
            this.router_history_model_of_Album_scroll = true
          }
        }
      }
    }
  },

  add_router_history_of_Album(new_Router_date: Interface_View_Router_Date) {
    const existingIndex = this.router_history_datas_of_Album.findIndex(
      (item) =>
        item.stmt_string === new_Router_date.stmt_string &&
        item.page_lists_keyword === new_Router_date.page_lists_keyword &&
        item.page_lists_selected === new_Router_date.page_lists_selected &&
        item.columnKey === new_Router_date.columnKey &&
        item.order === new_Router_date.order
    )

    if (existingIndex !== -1) {
      new_Router_date.id = this.router_history_datas_of_Album[existingIndex].id
      this.router_history_datas_of_Album[existingIndex] = new_Router_date
      this.router_select_history_date_of_Album = new_Router_date
      return
    }

    if (this.router_history_datas_of_Album.length >= 36) {
      this.router_history_datas_of_Album.shift()
      updateHistoryIds(this.router_history_datas_of_Album)
    }

    new_Router_date.id = this.router_history_datas_of_Album.length + 1
    this.router_history_datas_of_Album.push(new_Router_date)
    this.router_select_history_date_of_Album = new_Router_date
  },

  remove_router_history_of_Album(id: number) {
    const index = this.router_history_datas_of_Album.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.router_history_datas_of_Album.splice(index + 1)
    }
  },

  fix_router_history_of_Album_scroller_value(value: number) {
    const index = this.router_history_datas_of_Album.findIndex(
      (item) => item.id === (this.router_select_history_date_of_Album?.id ?? '')
    )
    if (index !== -1) {
      this.router_history_datas_of_Album[index].page_lists_scrollindex = value
    }
  },
})
function updateHistoryIds(historyData: Interface_View_Router_Date[]) {
  historyData.forEach((item, index) => {
    item.id = index + 1
  })
}
watch(
  () => store_router_history_data_of_album.router_history_datas_of_Album,
  (newValue) => {
    updateHistoryIds(newValue)
  }
)
