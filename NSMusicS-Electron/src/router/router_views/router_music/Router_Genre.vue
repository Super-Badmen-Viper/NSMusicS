<script setup lang="ts">
import { onMounted } from 'vue';
import Table_Genre from '@/views/view_music/music_page/page_genre/Table_Genre.vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'genre'
});
</script>

<template>
  <div class="view_show">
    <Table_Genre/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>