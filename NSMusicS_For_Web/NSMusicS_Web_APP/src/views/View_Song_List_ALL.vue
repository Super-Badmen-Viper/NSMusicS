<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Song_List from '../views/table/Table_Song_List_ALL.vue'

const data = ref<Media_File[]>([]);
const data_select_Index = ref<number>(-1)
function get_data_select_Index(value: any) {
  data_select_Index.value = value
  emit('data_select_Index',data_select_Index.value)
}
const data_page = ref<Media_File[]>([]);
function get_data_page(value: any) {
  data_page.value = value
  console.log('data_page：'+value)
  emit('media_PageFiles',data_page)
}
const page_Size = ref<number>(10)
function get_page_Size(value: number) {
  page_Size.value = value
  console.log('page_Size：'+value)
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

const fetchData = () => {
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.resolve('../NSMusicS_Web_APP/src/resource/db_sqllite/navidrome.db');
  const tableName = 'media_file';
  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
  
  let num = 0;
  db.serialize(() => {
    db.each(`SELECT * FROM ${tableName}`, (err: any, row: Media_File) => {
      if (err) {
        console.error(err.message);
        return;
      }
      row.duration_txt = formatTime(row.duration);
      data.value.push(row);

      if(num < page_Size.value){
        data_page.value.push(row);
      }
      num++;
    });
  });
  db.close();
};
onMounted(() => {
  fetchData();

  emit('media_Files',data)
  emit('media_PageFiles',data_page)
});


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
const emit = defineEmits();
function get_media_path(value: any) {
  emit('media_file_path',value)
  // router.push({name:'我的喜欢'});
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
</script>

<template>
  <div>
    <Table_Song_List class="table" 
      :data="data" 
      :data_temporary="data"
      @media_file_path="get_media_path" 
      @this_audio_singer_name="get_this_audio_singer_name"
      @this_audio_song_name="get_this_audio_song_name"
      @this_audio_album_name="get_this_audio_album_name"
      @data_select_Index="get_data_select_Index"
      @data_page="get_data_page" 
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

</style>
