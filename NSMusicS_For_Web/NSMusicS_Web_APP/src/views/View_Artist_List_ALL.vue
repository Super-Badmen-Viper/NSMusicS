<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Artist_List_ALL from '../views/table/Table_Artist_List_ALL_Grid_Virtual.vue'

const emit = defineEmits([
  'router_select',
  'artist_page_num',
  'artist_page_size',
  'page_artistlists_options_Sort_key','page_artistlists_keyword',
  'page_artistlists_selected','page_artistlists_reset_data',
  'album_list_of_artist_id_artist',
  'play_this_artist_song_list'
]);
function get_artist_page_num(value: any) {
  emit('artist_page_num',value)
}
function get_artist_PageSize(value: any) {
  emit('artist_page_size',value)
}
function get_page_artistlists_options_Sort_key(value: any) {
  emit('page_artistlists_options_Sort_key',value)
}
function get_router_select(value: any) {
  emit('router_select',value)
}
function set_page_artistlists_selected(value: boolean) {
  emit('page_artistlists_selected',value)
}
function page_artistlists_get_keyword(value: string) {
  emit('page_artistlists_keyword',value)
}
function page_artistlists_get_reset_data(value: any) {
  emit('page_artistlists_reset_data',value)
}
function get_album_list_of_artist_id_artist(value: any) {
  emit('album_list_of_artist_id_artist',value)
}
function get_play_this_artist_song_list(value: any) {
  emit('play_this_artist_song_list',value)
}
onMounted(async () => {
  emit('router_select','View_Artist_List_ALL')
});

const { 
  collapsed,
  window_innerWidth,

  change_page_header_color,page_artistlists_top_artist_image_url,page_artistlists_top_artist_name,page_artistlists_top_artist_id,
  page_artistlists,page_artistlists_options,page_artistlists_statistic,
  page_artistlists_selected,

  page_artistlists_keyword,

  page_artistlists_options_Sort_key,
  artist_Files_temporary,} = defineProps<{
  collapsed:boolean,
  window_innerWidth:number,

  change_page_header_color:boolean,page_artistlists_top_artist_image_url:string,page_artistlists_top_artist_name:string,page_artistlists_top_artist_id:string,
  page_artistlists:Play_List[],page_artistlists_options:{label: string;value: string}[],page_artistlists_statistic:{label: string;artist_count: number;id: string;}[],
  page_artistlists_selected:string;
    
  page_artistlists_keyword:string;

  page_artistlists_options_Sort_key:{ columnKey: string; order: string }[],
  artist_Files_temporary:Artist[],}>();
</script>

<template>
  <div class="view_show">
    <Table_Artist_List_ALL
      :data_temporary="artist_Files_temporary"

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