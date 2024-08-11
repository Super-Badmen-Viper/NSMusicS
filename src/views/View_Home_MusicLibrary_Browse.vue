<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import Table_Home_List_ALL_Line from '../views/table/Table_Home_List_ALL_Line_Virtual.vue'

function get_media_list_of_album_id(value: any){
  emits('media_list_of_album_id',value)
}
function get_play_this_album_song_list(value: any){
  emits('play_this_album_song_list',value)
}

onMounted(async () => {
  emits('router_select','View_Home_MusicLibrary_Browse')
});
const emits = defineEmits([
  'router_select','media_list_of_album_id','play_this_album_song_list',
]);
</script>

<template>
  <div class="view_show">
    <Table_Home_List_ALL_Line
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