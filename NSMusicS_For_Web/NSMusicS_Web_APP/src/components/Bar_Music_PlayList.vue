<script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/table/Table_Music_PlayList_Line_Virtual.vue'

const data_select_Index = ref<number>(-1)
function get_data_select_Index(value: any) {
  data_select_Index.value = value
  emit('data_select_Index',data_select_Index.value)
}

const menu_edit_this_song = ref<Media_File>()
function get_menu_edit_this_song(value: any) {
  menu_edit_this_song.value = value
  console.log('编辑：data_select_Index：'+value)
}
const menu_add_this_song = ref<Media_File>()
function get_menu_add_this_song(value: any) {
  menu_add_this_song.value = value
  console.log('添加到：data_select_Index：'+value)
}
const menu_delete_this_song = ref<Media_File>()
function get_menu_delete_this_song(value: any) {
  menu_delete_this_song.value = value
  console.log('添加到：data_select_Index：'+value)
}
onBeforeUnmount(() => {
  cleanup();
});
const cleanup = () => {
  data_select_Index.value = -1;
  menu_edit_this_song.value = undefined;
  menu_add_this_song.value = undefined;
  menu_delete_this_song.value = undefined;
};

// import { useRouter } from "vue-router";
// const router = useRouter();
const emit = defineEmits([
  'router_select',
  'playlist_Files',
  'media_file_path','media_file_path_from_playlist',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_id',
  'this_audio_album_name',
  'data_select_Index',
  'page_song_index',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'page_songlists_options_Sort_key',
  'page_songlists_keyword',
  'page_songlists_reset_data',
  'playlist_Files_selected_set',
  'playlist_Files_selected_set_all',
  'page_songlists_selected'
]);
function get_playlist_path(value: any) {
  emit('media_file_path',value)
}
function get_media_file_path_from_playlist(value: any) {
  emit('media_file_path_from_playlist',value)
}
function get_playlist_file_medium_image_url(value: any) {
  emit('media_file_medium_image_url',value)
}
function get_this_audio_singer_name(value: any) {
  emit('this_audio_singer_name',value)
}
function get_this_audio_song_name(value: any) {
  emit('this_audio_song_name',value)
}
function get_this_audio_album_id(value: any) {
  emit('this_audio_album_id',value)
}
function get_this_audio_album_name(value: any) {
  emit('this_audio_album_name',value)
}
function get_page_song_index(value: any) {
  emit('page_song_index',value)
}
function get_page_songlists_options_Sort_key(value: any) {
  emit('page_songlists_options_Sort_key',value)
}
function page_songlists_get_keyword(value: any) {
  emit('page_songlists_keyword',value)
}
function page_songlists_get_reset_data(value: any) {
  emit('page_songlists_reset_data',value)
}
function get_router_select(value: any) {
  emit('router_select',value)
}
function set_playlist_Files_selected(value: boolean) {
  emit('playlist_Files_selected_set',value)
}
function set_playlist_Files_selected_all(value: boolean) {
  emit('playlist_Files_selected_set_all',value)
}
onMounted(async () => {
  emit('router_select','View_Song_List_ALL')
});

const { 
  playlist_Files_temporary,playlist_Files_selected,
  } = defineProps<{
    playlist_Files_temporary:Media_File[],playlist_Files_selected:Media_File[],
  }>();
</script>

<template>
  <n-space class="this_Bar_Music_PlayList">
    <div class="layout_distribution_4">
      <Table_Song_List
        :data_temporary="playlist_Files_temporary"

        :data_temporary_selected="playlist_Files_selected"
        @playlist_Files_selected_set="set_playlist_Files_selected"
        @playlist_Files_selected_set_all="set_playlist_Files_selected_all"
        
        @media_file_path="get_playlist_path" 
        @media_file_path_from_playlist="get_media_file_path_from_playlist"
        @media_file_medium_image_url="get_playlist_file_medium_image_url"
        @this_audio_singer_name="get_this_audio_singer_name"
        @this_audio_song_name="get_this_audio_song_name"
        @this_audio_album_id="get_this_audio_album_id"
        @this_audio_album_name="get_this_audio_album_name"
        @data_select_Index="get_data_select_Index"
        @page_song_index="get_page_song_index"
        @menu_edit_this_song="get_menu_edit_this_song"
        @menu_add_this_song="get_menu_add_this_song"
        @menu_delete_this_song="get_menu_delete_this_song"
        @page_songlists_keyword="page_songlists_get_keyword"
        @page_songlists_reset_data="page_songlists_get_reset_data"/>
    </div>
  </n-space>
</template>


<style>
.this_Bar_Music_PlayList {
  margin-top: 0px;
  width: auto;
  height: auto;
  z-index: 100;
  border-radius: 12px 12px 0px 12px;
}

.layout_distribution_4 {
  display: flex;
  justify-content: space-between;
  z-index: 99;
}
</style>