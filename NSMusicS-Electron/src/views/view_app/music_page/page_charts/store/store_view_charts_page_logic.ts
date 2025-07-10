import { reactive, watch } from 'vue'

export const store_view_charts_page_logic = reactive({
  page_charts_bar_selected: 'media_file',
  page_charts_pie_selected: 'media_file',
  page_charts_polar_selected: 'media_file',
  page_charts_scatter_selected: 'media_file',

  async fetchData_Charts() {
    /// media_file
    /// album
    /// artist
    /// media_cue
  },
})
watch(
  () => store_view_charts_page_logic.page_charts_bar_selected,
  (newValue) => {}
)
watch(
  () => store_view_charts_page_logic.page_charts_pie_selected,
  (newValue) => {}
)
watch(
  () => store_view_charts_page_logic.page_charts_polar_selected,
  (newValue) => {}
)
watch(
  () => store_view_charts_page_logic.page_charts_scatter_selected,
  (newValue) => {}
)
