<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL_Grid_Virtual.vue'

const emits = defineEmits([
  'router_select',
  'album_page_size',
  'page_albumlists_options_Sort_key','page_albumlists_keyword','page_albumlists_reset_data',
  'page_albumlists_selected',
  'media_list_of_album_id',
  'play_this_album_song_list',
  'router_history_model',
]);
function get_album_PageSize(value: any) {
  emits('album_page_size',value)
}
function get_page_albumlists_options_Sort_key(value: any) {
  emits('page_albumlists_options_Sort_key',value)
}
function get_router_select(value: any) {
  emits('router_select',value)
}
function set_page_albumlists_selected(value: boolean) {
  emits('page_albumlists_selected',value)
}
function get_media_list_of_album_id(value: any) {
  emits('media_list_of_album_id',value)
}
function page_albumlists_get_keyword(value: string) {
  emits('page_albumlists_keyword',value)
}
function page_albumlists_get_reset_data(value: any) {
  emits('page_albumlists_reset_data',value)
}
function get_play_this_album_song_list(value: any) {
  emits('play_this_album_song_list',value)
}
function get_router_history_model(value: string) {
  emits('router_history_model',value)
}
onMounted(async () => {
  emits('router_select','View_Album_List_ALL')
});

const { 
  app_left_menu_collapsed,
  window_innerWidth,

  change_page_header_color,page_albumlists_top_album_image_url,page_albumlists_top_album_name,page_albumlists_top_album_id,
  page_albumlists,page_albumlists_options,page_albumlists_statistic,
  page_albumlists_selected,

  page_albumlists_options_Sort_key,page_albumlists_keyword,

  router_select_history_date,router_history_datas,
} = defineProps<{
  app_left_menu_collapsed:boolean,
  window_innerWidth:number,

  change_page_header_color:boolean,page_albumlists_top_album_image_url:string,page_albumlists_top_album_name:string,page_albumlists_top_album_id:string,
  page_albumlists:Play_List[],page_albumlists_options:{label: string;value: string}[],page_albumlists_statistic:{label: string;album_count: number;id: string;}[],
  page_albumlists_selected:string;

  page_albumlists_options_Sort_key:{ columnKey: string; order: string }[],
  album_Files_temporary:Album[],page_albumlists_keyword:string,
  
  router_select_history_date:Router_date,router_history_datas:Router_date[]
  }>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data_temporary="album_Files_temporary"

      @router_history_model="get_router_history_model"
      :router_select_history_date="router_select_history_date"
      :router_history_datas="router_history_datas"

      :change_page_header_color="change_page_header_color"
      :page_albumlists_top_album_image_url="page_albumlists_top_album_image_url"
      :page_albumlists_top_album_id="page_albumlists_top_album_id"
      :page_albumlists_top_album_name="page_albumlists_top_album_name"
      :page_albumlists_options="page_albumlists_options"
      :page_albumlists_statistic="page_albumlists_statistic"
      :page_albumlists="page_albumlists"
      :page_albumlists_selected="page_albumlists_selected"
      @page_albumlists_selected="set_page_albumlists_selected"

      @media_list_of_album_id="get_media_list_of_album_id"
      @play_this_album_song_list="get_play_this_album_song_list"

      :app_left_menu_collapsed="app_left_menu_collapsed"
      :window_innerWidth="window_innerWidth"
      :options_Sort_key="page_albumlists_options_Sort_key"
      @options_Sort_key="get_page_albumlists_options_Sort_key"
      :page_albumlists_keyword="page_albumlists_keyword"
      @page_albumlists_keyword="page_albumlists_get_keyword"
      @page_albumlists_reset_data="page_albumlists_get_reset_data"
      />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>