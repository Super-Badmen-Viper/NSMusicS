import { reactive, watch } from 'vue'
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'

export const store_view_home_page_logic = reactive({
  list_data_StartUpdate: false,
})

watch(
  () => store_view_home_page_logic.list_data_StartUpdate,
  (newValue) => {
    if (newValue) {
      store_general_fetch_home_list.fetchData_Home()
      store_view_media_page_logic.list_selected_Hand_click = true
      console.log('store_view_home_page_logic.list_data_StartUpdate')

      store_view_home_page_logic.list_data_StartUpdate = false
    }
  }
)
