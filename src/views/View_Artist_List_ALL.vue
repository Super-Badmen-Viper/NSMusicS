<script setup lang="ts">
import { onMounted,defineEmits } from 'vue';
import Table_Artist_List_ALL from '../views/table/Table_Artist_List_ALL_Grid_Virtual.vue'

function get_page_artistlists_options_Sort_key(value: any) {
  emits('page_artistlists_options_Sort_key',value)
}
function set_page_artistlists_selected(value: boolean) {
  emits('page_artistlists_selected',value)
}
function page_artistlists_get_keyword(value: string) {
  emits('page_artistlists_keyword',value)
}
function page_artistlists_get_reset_data(value: any) {
  emits('page_artistlists_reset_data',value)
}
function get_album_list_of_artist_id_by_artist_info(value: any) {
  emits('album_list_of_artist_id_artist',value)
}
function get_play_this_artist_song_list(value: any) {
  emits('play_this_artist_song_list',value)
}
function get_router_history_model(value: string) {
  emits('router_history_model',value)
}
function get_router_history_model_of_Artist_scroller_value(value: any) {
  emits('router_history_model_of_Artist_scroller_value',value)
}
function get_router_history_model_of_Artist_scroll(value: any) {
  emits('router_history_model_of_Artist_scroll',value)
}
onMounted(async () => {
  emits('router_select','View_Artist_List_ALL')
});

const emits = defineEmits([
  'router_select',
  'artist_page_num',
  'artist_page_size',
  'page_artistlists_options_Sort_key','page_artistlists_keyword',
  'page_artistlists_selected','page_artistlists_reset_data',
  'album_list_of_artist_id_artist',
  'play_this_artist_song_list',
  'router_history_model','router_history_model_of_Artist_scroller_value','router_history_model_of_Artist_scroll',
]);
const { 
  app_left_menu_collapsed,
  window_innerWidth,

  update_theme,page_top_album_image_url,page_top_album_name,page_top_album_id,
  page_artistlists,page_artistlists_options,page_artistlists_statistic,
  page_artistlists_selected,

  page_artistlists_keyword,

  page_artistlists_options_Sort_key,
  artist_Files_temporary,

  router_select_history_date,router_history_datas,router_history_model_of_Artist_scroller_value,router_history_model_of_Artist_scroll,
} = defineProps<{
  app_left_menu_collapsed:boolean,
  window_innerWidth:number,

  update_theme:boolean,page_top_album_image_url:string,page_top_album_name:string,page_top_album_id:string,
  page_artistlists:Play_List[],page_artistlists_options:{label: string;value: string}[],page_artistlists_statistic:{label: string;artist_count: number;id: string;}[],
  page_artistlists_selected:string;
    
  page_artistlists_keyword:string;

  page_artistlists_options_Sort_key:{ columnKey: string; order: string }[],
  artist_Files_temporary:Artist[],
  
  router_select_history_date:Interface_View_Router_Date,router_history_datas:Interface_View_Router_Date[],router_history_model_of_Artist_scroller_value:number,router_history_model_of_Artist_scroll:Boolean,
}>();
</script>

<template>
  <div class="view_show">
    <Table_Artist_List_ALL
      :data_temporary="artist_Files_temporary"

      @router_history_model="get_router_history_model"
      :router_select_history_date="router_select_history_date"
      :router_history_datas="router_history_datas"
      :router_history_model_of_Artist_scroller_value="router_history_model_of_Artist_scroller_value"
      @router_history_model_of_Artist_scroller_value="get_router_history_model_of_Artist_scroller_value"
      :router_history_model_of_Artist_scroll="router_history_model_of_Artist_scroll"
      @router_history_model_of_Artist_scroll="get_router_history_model_of_Artist_scroll"

      :update_theme="update_theme"
      :page_top_album_image_url="page_top_album_image_url"
      :page_top_album_id="page_top_album_id"
      :page_top_album_name="page_top_album_name"
      :page_artistlists_options="page_artistlists_options"
      :page_artistlists_statistic="page_artistlists_statistic"
      :page_artistlists="page_artistlists"
      :page_artistlists_selected="page_artistlists_selected"
      @page_artistlists_selected="set_page_artistlists_selected"

      @page_artistlists_reset_data="page_artistlists_get_reset_data"

      @album_list_of_artist_id_artist="get_album_list_of_artist_id_by_artist_info"
      @play_this_artist_song_list="get_play_this_artist_song_list"

      :page_artistlists_keyword="page_artistlists_keyword"
      @page_artistlists_keyword="page_artistlists_get_keyword"

      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
      :options_Sort_key="page_artistlists_options_Sort_key"
      @options_Sort_key="get_page_artistlists_options_Sort_key"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>