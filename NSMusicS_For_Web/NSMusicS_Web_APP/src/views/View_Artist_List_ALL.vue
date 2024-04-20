<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Artist_List_ALL from '../views/table/Table_Artist_List_ALL_Grid_Virtual.vue'

const emits = defineEmits([
  'router_select',
  'artist_page_num',
  'artist_page_size',
  'page_artistlists_options_Sort_key','page_artistlists_keyword',
  'page_artistlists_selected','page_artistlists_reset_data',
  'album_list_of_artist_id_artist',
  'play_this_artist_song_list',
  'router_history_model',
]);
function get_artist_page_num(value: any) {
  emits('artist_page_num',value)
}
function get_artist_PageSize(value: any) {
  emits('artist_page_size',value)
}
function get_page_artistlists_options_Sort_key(value: any) {
  emits('page_artistlists_options_Sort_key',value)
}
function get_router_select(value: any) {
  emits('router_select',value)
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
function get_album_list_of_artist_id_artist(value: any) {
  emits('album_list_of_artist_id_artist',value)
}
function get_play_this_artist_song_list(value: any) {
  emits('play_this_artist_song_list',value)
}
function get_router_history_model(value: string) {
  emits('router_history_model',value)
}
onMounted(async () => {
  emits('router_select','View_Artist_List_ALL')
});

const { 
  collapsed,
  window_innerWidth,

  change_page_header_color,page_artistlists_top_artist_image_url,page_artistlists_top_artist_name,page_artistlists_top_artist_id,
  page_artistlists,page_artistlists_options,page_artistlists_statistic,
  page_artistlists_selected,

  page_artistlists_keyword,

  page_artistlists_options_Sort_key,
  artist_Files_temporary,

  router_select_history_date,router_history_datas,
} = defineProps<{
  collapsed:boolean,
  window_innerWidth:number,

  change_page_header_color:boolean,page_artistlists_top_artist_image_url:string,page_artistlists_top_artist_name:string,page_artistlists_top_artist_id:string,
  page_artistlists:Play_List[],page_artistlists_options:{label: string;value: string}[],page_artistlists_statistic:{label: string;artist_count: number;id: string;}[],
  page_artistlists_selected:string;
    
  page_artistlists_keyword:string;

  page_artistlists_options_Sort_key:{ columnKey: string; order: string }[],
  artist_Files_temporary:Artist[],
  
  router_select_history_date:Router_date,router_history_datas:Router_date[]
  }>();
</script>

<template>
  <div class="view_show">
    <Table_Artist_List_ALL
      :data_temporary="artist_Files_temporary"

      @router_history_model="get_router_history_model"
      :router_select_history_date="router_select_history_date"
      :router_history_datas="router_history_datas"

      :change_page_header_color="change_page_header_color"
      :page_artistlists_top_artist_image_url="page_artistlists_top_artist_image_url"
      :page_artistlists_top_artist_id="page_artistlists_top_artist_id"
      :page_artistlists_top_artist_name="page_artistlists_top_artist_name"
      :page_artistlists_options="page_artistlists_options"
      :page_artistlists_statistic="page_artistlists_statistic"
      :page_artistlists="page_artistlists"
      :page_artistlists_selected="page_artistlists_selected"
      @page_artistlists_selected="set_page_artistlists_selected"

      @page_artistlists_reset_data="page_artistlists_get_reset_data"

      @album_list_of_artist_id_artist="get_album_list_of_artist_id_artist"
      @play_this_artist_song_list="get_play_this_artist_song_list"

      :page_artistlists_keyword="page_artistlists_keyword"
      @page_artistlists_keyword="page_artistlists_get_keyword"

      :collapsed="collapsed"
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