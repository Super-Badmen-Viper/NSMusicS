<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import Table_Home_List_ALL_Line from '../views/table/Table_Home_List_ALL_Line_Virtual.vue'

function get_media_list_of_album_id(value: any){
  emits('media_list_of_album_id',value)
}
function get_play_this_album_song_list(value: any){
  emits('play_this_album_song_list',value)
}
function get_home_selected_top_album(value: any){
  emits('home_selected_top_album',value)
}
function get_refresh_home_temporary(value: any){
  emits('refresh_home_temporary',value)
}

onMounted(async () => {
  emits('router_select','View_Home_MusicLibrary_Browse')
});
const emits = defineEmits([
  'router_select','media_list_of_album_id','play_this_album_song_list',
  'home_selected_top_album','refresh_home_temporary',
]);
const {
  home_Files_temporary_maximum_playback,home_Files_temporary_random_search,
  home_Files_temporary_recently_added,home_Files_temporary_recently_played,
  home_selected_top_album,
} = defineProps<{
  home_Files_temporary_maximum_playback:Album[],home_Files_temporary_random_search:Album[],
  home_Files_temporary_recently_added:Album[],home_Files_temporary_recently_played:Album[],
  home_selected_top_album:Album,
}>();
</script>

<template>
  <div class="view_show">
    <Table_Home_List_ALL_Line
      :home_Files_temporary_maximum_playback="home_Files_temporary_maximum_playback"
      :home_Files_temporary_random_search="home_Files_temporary_random_search"
      :home_Files_temporary_recently_added="home_Files_temporary_recently_added"
      :home_Files_temporary_recently_played="home_Files_temporary_recently_played"
      :home_selected_top_album="home_selected_top_album"
      @home_selected_top_album="get_home_selected_top_album"
      @refresh_home_temporary="get_refresh_home_temporary"
      @media_list_of_album_id="get_media_list_of_album_id"
      @play_this_album_song_list="get_play_this_album_song_list"
    />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>