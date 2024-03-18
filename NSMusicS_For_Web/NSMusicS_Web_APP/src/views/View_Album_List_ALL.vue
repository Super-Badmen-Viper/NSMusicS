<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL_Grid_Virtual.vue'

const emit = defineEmits([
  'router_select',
  'album_page_num',
  'album_page_size',
  'page_albumlists_options_Sort_key',
  'page_albumlists_selected'
]);
function get_album_page_num(value: any) {
  emit('album_page_num',value)
}
function get_album_PageSize(value: any) {
  emit('album_page_size',value)
}
function get_page_albumlists_options_Sort_key(value: any) {
  emit('page_albumlists_options_Sort_key',value)
}
function get_router_select(value: any) {
  emit('router_select',value)
}
function set_page_albumlists_selected(value: boolean) {
  emit('page_albumlists_selected',value)
}
onMounted(async () => {
  emit('router_select','View_Album_List_ALL')
});

const { 
  collapsed,
  window_innerWidth,

  change_page_header_color,page_albumlists_top_album_image_url,page_albumlists_top_album_name,
  page_albumlists,page_albumlists_options,page_albumlists_statistic,
  page_albumlists_selected,

  page_albumlists_options_Sort_key,
  album_Files_temporary,album_page_num,album_page_size,album_Page_length,} = defineProps<{
  collapsed:boolean,
  window_innerWidth:number,

  change_page_header_color:boolean,page_albumlists_top_album_image_url:string,page_albumlists_top_album_name:string,
  page_albumlists:Play_List[],page_albumlists_options:{label: string;value: string}[],page_albumlists_statistic:{label: string;album_count: number;id: string;}[],
  page_albumlists_selected:string;

  page_albumlists_options_Sort_key:{ columnKey: string; order: string }[],
  album_Files_temporary:Album[],
  album_page_num:number,album_page_size:number,album_Page_length:number,}>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data_temporary="album_Files_temporary"

      :change_page_header_color="change_page_header_color"
      :page_albumlists_top_album_image_url="page_albumlists_top_album_image_url"
      :page_albumlists_top_album_name="page_albumlists_top_album_name"
      :page_albumlists_options="page_albumlists_options"
      :page_albumlists_statistic="page_albumlists_statistic"
      :page_albumlists="page_albumlists"
      :page_albumlists_selected="page_albumlists_selected"
      @page_albumlists_selected="set_page_albumlists_selected"

      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      :page="album_page_num"
      :pageSize="album_page_size"
      :pageCount="album_Page_length"
      @album_page_num="get_album_page_num"
      @album_page_size="get_album_PageSize"
      :options_Sort_key="page_albumlists_options_Sort_key"
      @options_Sort_key="get_page_albumlists_options_Sort_key"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>