<script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/table/Table_Music_PlayList_Line_Virtual.vue'

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
function get_page_songlists_options_Sort_key(value: any) {
  emits('page_songlists_options_Sort_key',value)
}
function page_songlists_get_reset_data(value: any) {
  emits('page_songlists_reset_data',value)
}
onMounted(async () => {
  emits('router_select','View_Song_List_ALL')
});
onBeforeUnmount(() => {
  menu_edit_this_song.value = undefined;
  menu_add_this_song.value = undefined;
  menu_delete_this_song.value = undefined;
});

const emits = defineEmits([
  'router_select',
  'playlist_Files',
  'media_file_path_from_playlist',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'page_songlists_options_Sort_key',
  'page_songlists_reset_data',
]);
</script>

<template>
  <n-space class="this_Bar_Music_PlayList">
    <div class="layout_distribution_4">
      <Table_Song_List
        @menu_edit_this_song="get_menu_edit_this_song"
        @menu_add_this_song="get_menu_add_this_song"
        @menu_delete_this_song="get_menu_delete_this_song"
        @page_songlists_reset_data="page_songlists_get_reset_data"/>
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