<script setup lang="ts">
import { onMounted } from 'vue';
import TableAlbum from '@/views/view_music/page_music/page_album/Table_Album.vue'
import {store_router_data_info} from "@/router/store_router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'album'
});

</script>

<template>
  <div class="view_show">
    <TableAlbum/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>