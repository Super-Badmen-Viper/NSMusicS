import { reactive, watch } from 'vue'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_artist_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_artist/store_general_fetch_artist_list'
import { store_router_history_data_of_album } from './store_router_history_data_of_album'

export const store_router_history_data_of_artist = reactive({
  router_history_model_of_Artist_scroll: false,
  router_history_model_of_Artist_scroller_value: 0,

  router_history_datas_of_Artist: [] as Interface_View_Router_Date[],
  router_select_history_date_of_Artist: null as Interface_View_Router_Date | null,
  router_history_model_of_Artist: 0,

  get_router_history_model_of_Artist(value: number) {
    if (value !== 0) {
      this.router_history_model_of_Artist = value
      const currentIndex = this.router_history_datas_of_Artist.findIndex(
        (item) => item.id === (this.router_select_history_date_of_Artist?.id ?? '')
      )

      if (currentIndex !== -1) {
        const newIndex = currentIndex + value
        if (newIndex >= 0 && newIndex < this.router_history_datas_of_Artist.length) {
          this.fix_router_history_of_Artist_scroller_value(
            this.router_history_model_of_Artist_scroller_value
          ) // 保留此滚轮值(上次浏览位置)
          this.router_select_history_date_of_Artist = this.router_history_datas_of_Artist[newIndex]
          store_router_data_logic.clear_Files_temporary()
          const selectedRouterName = this.router_select_history_date_of_Artist.router_name
          if (selectedRouterName === 'artist') {
            store_router_data_info.router_select_model_artist = true
            store_general_fetch_artist_list.fetchData_Artist()
            this.router_history_model_of_Artist_scroll = true
          }
        }
      }
    }
  },

  add_router_history_of_Artist(new_Router_date: Interface_View_Router_Date) {
    const existingIndex = this.router_history_datas_of_Artist.findIndex(
      (item) =>
        item.stmt_string === new_Router_date.stmt_string &&
        item.page_lists_keyword === new_Router_date.page_lists_keyword &&
        item.page_lists_selected === new_Router_date.page_lists_selected &&
        item.columnKey === new_Router_date.columnKey &&
        item.order === new_Router_date.order
    )

    if (existingIndex !== -1) {
      new_Router_date.id = this.router_history_datas_of_Artist[existingIndex].id
      this.router_history_datas_of_Artist[existingIndex] = new_Router_date
      this.router_select_history_date_of_Artist = new_Router_date
      return
    }

    if (this.router_history_datas_of_Artist.length >= 36) {
      this.router_history_datas_of_Artist.shift()
      updateHistoryIds(this.router_history_datas_of_Artist)
    }

    new_Router_date.id = this.router_history_datas_of_Artist.length + 1
    this.router_history_datas_of_Artist.push(new_Router_date)
    this.router_select_history_date_of_Artist = new_Router_date
  },

  remove_router_history_of_Artist(id: number) {
    const index = this.router_history_datas_of_Artist.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.router_history_datas_of_Artist.splice(index + 1)
    }
  },

  fix_router_history_of_Artist_scroller_value(value: number) {
    const index = this.router_history_datas_of_Artist.findIndex(
      (item) => item.id === (this.router_select_history_date_of_Artist?.id ?? '')
    )
    if (index !== -1) {
      this.router_history_datas_of_Artist[index].page_lists_scrollindex = value
    }
  },
})
function updateHistoryIds(historyData: Interface_View_Router_Date[]) {
  historyData.forEach((item, index) => {
    item.id = index + 1
  })
}
watch(
  () => store_router_history_data_of_artist.router_history_datas_of_Artist,
  (newValue) => {
    updateHistoryIds(newValue)
  }
)
