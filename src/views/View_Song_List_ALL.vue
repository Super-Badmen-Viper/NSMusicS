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
function get_this_audio_album_id(value: any) {
  emits('this_audio_album_id',value)
}
function get_this_audio_album_name(value: any) {
  emits('this_audio_album_name',value)
}
function get_page_songlists_options_Sort_key(value: any) {
  emits('page_songlists_options_Sort_key',value)
}
function page_songlists_get_keyword(value: any) {
  emits('page_songlists_keyword',value)
}
function page_songlists_get_reset_data(value: any) {
  emits('page_songlists_reset_data',value)
}
function get_media_Files_selected(value: Media_File) {
  emits('media_Files_selected',value)
}
function set_media_Files_selected(value: boolean) {
  emits('media_Files_selected_set',value)
}
function set_media_Files_selected_all(value: boolean) {
  emits('media_Files_selected_set_all',value)
}
function set_page_songlists_selected(value: boolean) {
  emits('page_songlists_selected',value)
}
function get_this_audio_lyrics_string(value: string) {
  emits('this_audio_lyrics_string',value)
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
function get_this_audio_song_rating(value: any) {
  emits('this_audio_song_rating',value)
}
function get_this_audio_song_favorite(value: any) {
  emits('this_audio_song_favorite',value)
}
function get_playlist_Tracks_temporary_add(value: any){
  emits('playlist_Tracks_temporary_add',value)
}
function get_playlist_Tracks_temporary_update(value: any){
  emits('playlist_Tracks_temporary_update',value)
}
function get_playlist_Tracks_temporary_delete(value: any){
  emits('playlist_Tracks_temporary_delete',value)
}
function get_playlist_Tracks_temporary_update_media_file(value: any){
  emits('playlist_Tracks_temporary_update_media_file',value)
}
function get_selected_playlist_addMediaFile(value: any){
  emits('selected_playlist_addMediaFile',value)
}
function get_selected_playlist_deleteMediaFile(value: any){
  emits('selected_playlist_deleteMediaFile',value)
}
function get_selected_lovelist_addMediaFile(value: any){
  emits('selected_lovelist_addMediaFile',value)
}
function get_selected_locallist_deleteMediaFile(value: any){
  emits('selected_locallist_deleteMediaFile',value)
}
function get_selected_lovelist_deleteMediaFile(value: any){
  emits('selected_lovelist_deleteMediaFile',value)
}
function get_selected_recentlist_deletetMediaFile(value: any){
  emits('selected_recentlist_deletetMediaFile',value)
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
  'this_audio_song_rating','this_audio_song_favorite',
  'this_audio_album_id','this_audio_album_name',
  'this_audio_Index_of_absolute_positioning_in_list',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'page_songlists_options_Sort_key',
  'page_songlists_keyword',
  'page_songlists_reset_data',
  'media_Files_selected',
  'media_Files_selected_set',
  'media_Files_selected_set_all',
  'page_songlists_selected',
  'this_audio_lyrics_string',
  'router_history_model',
  'router_history_model_of_Media_scroller_value','router_history_model_of_Media_scroll',
  'playlist_Tracks_temporary_add','playlist_Tracks_temporary_update','playlist_Tracks_temporary_delete',
  'playlist_Tracks_temporary_update_media_file',
  'selected_playlist_addMediaFile','selected_playlist_deleteMediaFile',
  'selected_locallist_deleteMediaFile',
  'selected_lovelist_addMediaFile',
  'selected_lovelist_deleteMediaFile','selected_recentlist_deletetMediaFile'
]);
const {
  page_top_album_image_url,page_top_album_name,page_top_album_id,
  page_songlists,page_songlists_options,page_songlists_statistic,
  page_songlists_selected,

  page_songlists_keyword,

  media_Files_temporary,media_Files_selected,
  page_songlists_options_Sort_key,

  playlist_All_of_list,playlist_Tracks_temporary,

  router_select_history_date,router_history_datas,router_history_model_of_Media_scroller_value,router_history_model_of_Media_scroll
} = defineProps<{
  page_top_album_image_url:string,page_top_album_name:string,page_top_album_id:string,
  page_songlists:Play_List[],page_songlists_options:{label: string;value: string}[],page_songlists_statistic:{label: string;song_count: number;id: string;}[],
  page_songlists_selected:string;

  page_songlists_keyword:string;

  media_Files_temporary:Media_File[],media_Files_selected:Media_File[],
  page_songlists_options_Sort_key:{ columnKey: string; order: string }[],

  playlist_All_of_list:{label: string;value: string}[],playlist_Tracks_temporary:{playlist:Play_List,playlist_tracks:Play_list_Track[]}[],

  router_select_history_date:Interface_View_Router_Date,router_history_datas:Interface_View_Router_Date[],router_history_model_of_Media_scroller_value:number,router_history_model_of_Media_scroll:Boolean,
}>();
</script>

<template>
  <div class="view_show">
    <Table_Song_List
        :data_temporary="media_Files_temporary"
        :data_temporary_selected="media_Files_selected"

        @router_history_model="get_router_history_model"
        :router_select_history_date="router_select_history_date"
        :router_history_datas="router_history_datas"
        :router_history_model_of_Media_scroller_value="router_history_model_of_Media_scroller_value"
        @router_history_model_of_Media_scroller_value="get_router_history_model_of_Media_scroller_value"
        :router_history_model_of_Media_scroll="router_history_model_of_Media_scroll"
        @router_history_model_of_Media_scroll="get_router_history_model_of_Media_scroll"

        :page_top_album_image_url="page_top_album_image_url"
        :page_top_album_id="page_top_album_id"
        :page_top_album_name="page_top_album_name"
        :page_songlists_options="page_songlists_options"
        :page_songlists_statistic="page_songlists_statistic"
        :page_songlists="page_songlists"
        :page_songlists_selected="page_songlists_selected"
        @page_songlists_selected="set_page_songlists_selected"

        @media_Files_selected="get_media_Files_selected"
        @media_Files_selected_set="set_media_Files_selected"
        @media_Files_selected_set_all="set_media_Files_selected_all"

        @this_audio_lyrics_string="get_this_audio_lyrics_string"
        @media_file_path_from_playlist="get_media_file_path_from_playlist"
        @this_audio_song_rating="get_this_audio_song_rating"
        @this_audio_song_favorite="get_this_audio_song_favorite"
        @this_audio_album_name="get_this_audio_album_name"
        @this_audio_album_id="get_this_audio_album_id"

        @menu_edit_this_song="get_menu_edit_this_song"
        @menu_add_this_song="get_menu_add_this_song"
        @menu_delete_this_song="get_menu_delete_this_song"
        :options_Sort_key="page_songlists_options_Sort_key"
        @options_Sort_key="get_page_songlists_options_Sort_key"
        :page_songlists_keyword="page_songlists_keyword"
        @page_songlists_keyword="page_songlists_get_keyword"
        @page_songlists_reset_data="page_songlists_get_reset_data"

        :playlist_All_of_list="playlist_All_of_list"
        :playlist_Tracks_temporary="playlist_Tracks_temporary"
        @playlist_Tracks_temporary_add="get_playlist_Tracks_temporary_add"
        @playlist_Tracks_temporary_update="get_playlist_Tracks_temporary_update"
        @playlist_Tracks_temporary_delete="get_playlist_Tracks_temporary_delete"
        @playlist_Tracks_temporary_update_media_file="get_playlist_Tracks_temporary_update_media_file"
        @selected_playlist_addMediaFile="get_selected_playlist_addMediaFile"
        @selected_playlist_deleteMediaFile="get_selected_playlist_deleteMediaFile"
        @selected_locallist_deleteMediaFile="get_selected_locallist_deleteMediaFile"
        @selected_lovelist_addMediaFile="get_selected_lovelist_addMediaFile"
        @selected_lovelist_deleteMediaFile="get_selected_lovelist_deleteMediaFile"
        @selected_recentlist_deletetMediaFile="get_selected_recentlist_deletetMediaFile"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>