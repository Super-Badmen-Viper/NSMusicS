<script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/table/Table_Music_PlayList_Line_Virtual.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

const menu_edit_this_song = ref<Media_File>()
function get_menu_edit_this_song(value: any) {
  menu_edit_this_song.value = value
  console.log('编辑：this_audio_Index_of_absolute_positioning_in_list：'+value)
}
const menu_add_this_song = ref<Media_File>()
function get_menu_add_this_song(value: any) {
  menu_add_this_song.value = value
  console.log('添加到：this_audio_Index_of_absolute_positioning_in_list：'+value)
}
const menu_delete_this_song = ref<Media_File>()
function get_menu_delete_this_song(value: any) {
  menu_delete_this_song.value = value
  console.log('添加到：this_audio_Index_of_absolute_positioning_in_list：'+value)
}
onMounted(async () => {
  store_router_data_info.router_select = 'View_Song_List_ALL'
});
onBeforeUnmount(() => {
  menu_edit_this_song.value = undefined;
  menu_add_this_song.value = undefined;
  menu_delete_this_song.value = undefined;
});
</script>

<template>
  <n-space class="this_Bar_Music_PlayList">
    <div class="layout_distribution_4">
      <Table_Song_List
        @menu_edit_this_song="get_menu_edit_this_song"
        @menu_add_this_song="get_menu_add_this_song"
        @menu_delete_this_song="get_menu_delete_this_song"/>
    </div>
  </n-space>
</template>


<style>
.this_Bar_Music_PlayList {
  margin-top: 0;
  z-index: 100;
  border-radius: 12px 12px 0 12px;
}
.layout_distribution_4 {
  display: flex;
  justify-content: space-between;
  z-index: 99;
}
</style>