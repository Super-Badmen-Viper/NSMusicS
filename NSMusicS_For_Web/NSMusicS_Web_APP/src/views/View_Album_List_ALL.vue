<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL_Lineblock.vue'

const emit = defineEmits([
  'album_page_num',
  'album_page_Size',
]);
function get_album_page_num(value: any) {
  emit('album_page_num',value)
}
function get_album_page_Size(value: any) {
  emit('album_page_Size',value)
}

const { 
  collapsed,
  window_innerWidth,
  Album_Files,Album_Files_temporary,Album_PageCount } = defineProps<{
  collapsed:Boolean,
  window_innerWidth:number,
  Album_Files:Item_Album[],Album_Files_temporary:Item_Album[],Album_PageCount:number}>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data="Album_Files" 
      :data_temporary="Album_Files_temporary"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      :pageCount="Album_PageCount"
      @album_page_num="get_album_page_num"
      @album_page_Size="get_album_page_Size"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
