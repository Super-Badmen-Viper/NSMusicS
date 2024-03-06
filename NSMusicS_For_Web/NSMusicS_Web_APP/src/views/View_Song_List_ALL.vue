<script setup lang="ts">
import { ref,defineEmits, onBeforeUnmount, onMounted } from 'vue';
import Table_Song_List from '../views/table/Table_Song_List_ALL.vue'

const data_select_Index = ref<number>(-1)
function get_data_select_Index(value: any) {
  data_select_Index.value = value
  emit('data_select_Index',data_select_Index.value)
}
function get_media_page_size(value: number) {
  emit('media_page_size',value)
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
  'media_Files',
  'media_file_path',
  'media_file_medium_image_url',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name',
  'data_select_Index',
  'page_song_index',
  'media_page_num',
  'media_page_size',
  'media_PageFiles',
  'menu_edit_this_song',
  'menu_add_this_song',
  'menu_delete_this_song',
  'options_Sort_key',
  'keyword',
  'reset_data'
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
function get_media_page_num(value: any) {
  emit('media_page_num',value)
}
function get_media_PageFiles(value: any) {
  emit('media_PageFiles',value)
}
function get_options_Sort_key(value: any) {
  emit('options_Sort_key',value)
}
function get_keyword(value: any) {
  emit('keyword',value)
}
function get_reset_data(value: any) {
  emit('reset_data',value)
}
function get_router_select(value: any) {
  emit('router_select',value)
}
onMounted(async () => {
  emit('router_select','View_Song_List_ALL')
});

const { 
  collapsed,window_innerWidth,
  media_Files,media_Files_temporary,
  options_Sort_key,
  media_page_num,media_page_size,media_page_length
  } = defineProps<{
    collapsed:Boolean,window_innerWidth:number,
    media_Files:Media_File[],media_Files_temporary:Media_File[],
    options_Sort_key:{ columnKey: string; order: string }[],
    media_page_num:number,media_page_size:number,media_page_length:number
  }>();
</script>

<template>
  <div class="view_show">
    <Table_Song_List
      :data="media_Files" 
      :data_temporary="media_Files_temporary"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      @media_file_path="get_media_path" 
      @media_file_medium_image_url="get_media_file_medium_image_url"
      @this_audio_singer_name="get_this_audio_singer_name"
      @this_audio_song_name="get_this_audio_song_name"
      @this_audio_album_name="get_this_audio_album_name"
      @data_select_Index="get_data_select_Index"
      @page_song_index="get_page_song_index"
      :media_page_num="media_page_num"
      @media_page_num="get_media_page_num"
      :media_page_size="media_page_size"
      @media_page_size="get_media_page_size"
      :media_page_length="media_page_length"
      @media_PageFiles="get_media_PageFiles"
      @menu_edit_this_song="get_menu_edit_this_song"
      @menu_add_this_song="get_menu_add_this_song"
      @menu_delete_this_song="get_menu_delete_this_song"
      :options_Sort_key="options_Sort_key"
      @options_Sort_key="get_options_Sort_key"
      @keyword="get_keyword"
      @reset_data="get_reset_data"/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
