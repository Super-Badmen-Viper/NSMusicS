<script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/table/Table_Song_List_ALL_Line_Virtual.vue'
import {RouterView} from "vue-router";

const this_audio_Index_of_absolute_positioning_in_list = ref<number>(-1)
function get_this_audio_Index_of_absolute_positioning_in_list(value: any) {
  this_audio_Index_of_absolute_positioning_in_list.value = value
  emits('this_audio_Index_of_absolute_positioning_in_list',this_audio_Index_of_absolute_positioning_in_list.value)
}
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
function get_media_file_path_from_playlist(value: any) {
  emits('media_file_path_from_playlist',value)
}
function get_page_songlists_options_Sort_key(value: any) {
  emits('page_songlists_options_Sort_key',value)
}
function page_songlists_get_reset_data(value: any) {
  emits('page_songlists_reset_data',value)
}
function get_media_Files_selected(value: Media_File) {
  emits('media_Files_selected',value)
}
function get_router_history_model(value: string) {
  emits('router_history_model',value)
}
function get_router_history_model_of_Media_scroller_value(value: any) {
  emits('router_history_model_of_Media_scroller_value',value)
}
function get_router_history_model_of_Media_scroll(value: any) {
  emits('router_history_model_of_Media_scroll',value)
}
onMounted(async () => {
  emits('router_select','View_Song_List_ALL')
});
onBeforeUnmount(() => {
  this_audio_Index_of_absolute_positioning_in_list.value = -1;
  menu_edit_this_song.value = undefined;
  menu_add_this_song.value = undefined;
  menu_delete_this_song.value = undefined;
});

const emits = defineEmits([
  'router_select',
  'media_Files',
  'media_file_path_from_playlist',
  'this_audio_Index_of_absolute_positioning_in_list',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'page_songlists_options_Sort_key',
  'page_songlists_reset_data',
  'media_Files_selected',
  'router_history_model',
  'router_history_model_of_Media_scroller_value','router_history_model_of_Media_scroll',
]);
const {
  media_Files_selected,
  page_songlists_options_Sort_key,

  router_select_history_date,router_history_datas,router_history_model_of_Media_scroller_value,router_history_model_of_Media_scroll
} = defineProps<{
  media_Files_selected:Media_File[],
  page_songlists_options_Sort_key:{ columnKey: string; order: string }[],

  router_select_history_date:Interface_View_Router_Date,router_history_datas:Interface_View_Router_Date[],router_history_model_of_Media_scroller_value:number,router_history_model_of_Media_scroll:Boolean,
}>();
</script>

<template>
  <div class="view_show">
    <Table_Song_List
        :data_temporary_selected="media_Files_selected"

        @router_history_model="get_router_history_model"
        :router_select_history_date="router_select_history_date"
        :router_history_datas="router_history_datas"
        :router_history_model_of_Media_scroller_value="router_history_model_of_Media_scroller_value"
        @router_history_model_of_Media_scroller_value="get_router_history_model_of_Media_scroller_value"
        :router_history_model_of_Media_scroll="router_history_model_of_Media_scroll"
        @router_history_model_of_Media_scroll="get_router_history_model_of_Media_scroll"

        @media_Files_selected="get_media_Files_selected"

        @media_file_path_from_playlist="get_media_file_path_from_playlist"

        @menu_edit_this_song="get_menu_edit_this_song"
        @menu_add_this_song="get_menu_add_this_song"
        @menu_delete_this_song="get_menu_delete_this_song"
        :options_Sort_key="page_songlists_options_Sort_key"
        @options_Sort_key="get_page_songlists_options_Sort_key"
        @page_songlists_reset_data="page_songlists_get_reset_data"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>