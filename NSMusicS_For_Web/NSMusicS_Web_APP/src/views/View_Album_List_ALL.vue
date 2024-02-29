<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL_Lineblock.vue'

const emit = defineEmits([
  'album_Page',
  'album_PageSize',
]);
function get_album_page_num(value: any) {
  emit('album_Page',value)
}
function get_album_PageSize(value: any) {
  emit('album_PageSize',value)
}

const { 
  collapsed,
  window_innerWidth,
  Album_Files,Album_Files_temporary,album_Page,album_PageSize,album_PageCount } = defineProps<{
  collapsed:Boolean,
  window_innerWidth:number,
  Album_Files:Item_Album[],Album_Files_temporary:Item_Album[],album_Page:number,album_PageSize:number,album_PageCount:number}>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data="Album_Files" 
      :data_temporary="Album_Files_temporary"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      :page="album_Page"
      :pageSize="album_PageSize"
      :pageCount="album_PageCount"
      @album_Page="get_album_page_num"
      @album_PageSize="get_album_PageSize"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
