<script setup lang="ts">
import { ref, onMounted,defineEmits, onBeforeUnmount } from 'vue';
import Table_Song_List from '../views/table/Table_Song_List_ALL.vue'
import { ipcRenderer } from 'electron';

const data_select_Index = ref<number>(-1)
function get_data_select_Index(value: any) {
  data_select_Index.value = value
  emit('data_select_Index',data_select_Index.value)
}
function get_page_Size(value: number) {
  emit('page_Size',value)
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

function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    let formattedMinutes = String(minutes);
    let formattedSeconds = String(seconds);

    if(formattedMinutes.length == 1)
      formattedMinutes = '0' + formattedMinutes;
    formattedMinutes = formattedMinutes.replace('.','');
    formattedMinutes = formattedMinutes.substring(0, 2);

    formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
    if(formattedSeconds.length == 1)
      formattedSeconds = '0' + formattedSeconds;
    formattedSeconds = formattedSeconds.substring(0, 2);

    return `${formattedMinutes}:${formattedSeconds}`;
}

// import { useRouter } from "vue-router";
// const router = useRouter();
const emit = defineEmits([
  'media_Files',
  'media_file_path',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name',
  'data_select_Index',
  'page_song_index',
  'page_num',
  'page_Size',
  'media_PageFiles',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song'
]);
function get_media_path(value: any) {
  emit('media_file_path',value)
}
function get_media_file_medium_image_url(value: any) {
  emit('media_file_medium_image_url',value)
}
function get_this_audio_singer_name(value: any) {
  emit('this_audio_singer_name',value)
}
function get_this_audio_song_name(value: any) {
  emit('this_audio_song_name',value)
}
function get_this_audio_album_name(value: any) {
  emit('this_audio_album_name',value)
}
function get_page_song_index(value: any) {
  emit('page_song_index',value)
}
function get_page_num(value: any) {
  emit('page_num',value)
}
function get_media_PageFiles(value: any) {
  emit('media_PageFiles',value)
}

const { 
  collapsed,window_innerWidth,
  media_Files 
  } = defineProps<{
    collapsed:Boolean,window_innerWidth:number,
    media_Files:Media_File[]
  }>();
</script>

<template>
  <div class="view_show">
    <Table_Song_List
      :data="media_Files"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      @media_file_path="get_media_path" 
      @media_file_medium_image_url="get_media_file_medium_image_url"
      @this_audio_singer_name="get_this_audio_singer_name"
      @this_audio_song_name="get_this_audio_song_name"
      @this_audio_album_name="get_this_audio_album_name"
      @data_select_Index="get_data_select_Index"
      @page_song_index="get_page_song_index"
      @page_num="get_page_num"
      @page_Size="get_page_Size"
      @media_PageFiles="get_media_PageFiles"
      @menu_edit_this_song="get_menu_edit_this_song"
      @menu_add_this_song="get_menu_add_this_song"
      @menu_delete_this_song="get_menu_delete_this_song"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
