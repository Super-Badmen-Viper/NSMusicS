<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL_Lineblock.vue'

const emit = defineEmits([
  'router_select',
  'album_page_num',
  'album_page_size',
  'options_Sort_key',
]);
function get_album_page_num(value: any) {
  emit('album_page_num',value)
}
function get_album_PageSize(value: any) {
  emit('album_page_size',value)
}
function get_options_Sort_key(value: any) {
  emit('options_Sort_key',value)
}
function get_router_select(value: any) {
  emit('router_select',value)
}
onMounted(async () => {
  emit('router_select','View_Album_List_ALL')
});

const { 
  collapsed,
  window_innerWidth,
  options_Sort_key,
  Album_Files,Album_Files_temporary,album_page_num,album_page_size,album_Page_length } = defineProps<{
  collapsed:Boolean,
  window_innerWidth:number,
  options_Sort_key:{ columnKey: string; order: string }[],
  Album_Files:Item_Album[],Album_Files_temporary:Item_Album[],album_page_num:number,album_page_size:number,album_Page_length:number}>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data="Album_Files" 
      :data_temporary="Album_Files_temporary"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      :page="album_page_num"
      :pageSize="album_page_size"
      :pageCount="album_Page_length"
      @album_page_num="get_album_page_num"
      @album_page_size="get_album_PageSize"
      :options_Sort_key="options_Sort_key"
      @options_Sort_key="get_options_Sort_key"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
