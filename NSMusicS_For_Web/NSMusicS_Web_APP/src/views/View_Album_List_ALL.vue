<script setup lang="ts">
import { ref, onMounted,defineEmits } from 'vue';
import Table_Album_List_ALL from '../views/table/Table_Album_List_ALL.vue'

const data = ref<Item_Album[]>([]);
const data_select_Index = ref<number>(-1)
function get_data_select_Index(value: any) {
  data_select_Index.value = value
  emit('data_select_Index',data_select_Index.value)
}
const data_page = ref<Item_Album[]>([]);
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

const menu_edit_this_song = ref<Item_Album>()
function get_menu_edit_this_song(value: any) {
  menu_edit_this_song.value = value
  console.log('编辑：data_select_Index：'+value)
}
const menu_add_this_song = ref<Item_Album>()
function get_menu_add_this_song(value: any) {
  menu_add_this_song.value = value
  console.log('添加到：data_select_Index：'+value)
}
const menu_delete_this_song = ref<Item_Album>()
function get_menu_delete_this_song(value: any) {
  menu_delete_this_song.value = value
  console.log('添加到：data_select_Index：'+value)
}

const fetchData = () => {
  const path = require('path');
  const Database = require('better-sqlite3');
  const dbPath = path.resolve('resources/navidrome.db');
  console.log(dbPath)
  const tableName = 'album';
  const db = new Database(dbPath, { verbose: console.log }); 
  let num = 0;
  try {
    const stmt = db.prepare(`SELECT * FROM ${tableName}`);
    const rows = stmt.all();
    rows.forEach((row: Item_Album) => {
      row.medium_image_url = row.embed_art_path.replace('mp3','jpg');

      // 使用正则表达式匹配文件名部分
      let fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
      // 提取文件名
      let fileNameWithExtension: string | null = fileNameMatch ? fileNameMatch[0] : null;
      // 使用正则表达式去除文件后缀
      let fileNameWithoutExtension: string | null = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
      // 使用正则表达式去除-及其之前的部分
      const fileNameWithoutPrefix: string | null = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
      if(fileNameWithoutPrefix != null)
        row.title = fileNameWithoutPrefix;

      row.album_title = row.title+"<br>"+row.artist

      data.value.push(row);
      if (num < page_Size.value) {
          data_page.value.push(row);
      }
      num++;
    });
  } catch (err: any) {
    console.error(err.message);
  } finally {
    db.close();
  }
};
onMounted(() => {
  fetchData();

  emit('media_Files',data)
  emit('media_PageFiles',data_page)
});

// import { useRouter } from "vue-router";
// const router = useRouter();
const emit = defineEmits([
  'media_Files',
  'media_file_medium_image_url',
  'media_file_path',
  'this_audio_singer_name',
  'this_audio_song_name',
  'this_audio_album_name',
  'data_select_Index',
  'data_page',
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
  // router.push({name:'我的喜欢'});
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

const { collapsed,window_innerWidth } = defineProps<{collapsed:Boolean,window_innerWidth:number}>();
</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL
      :data="data"
      :collapsed="collapsed"
      :window_innerWidth="window_innerWidth"
      @media_file_path="get_media_path" 
      @media_file_medium_image_url="get_media_file_medium_image_url"
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
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
