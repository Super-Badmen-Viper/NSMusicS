<script setup lang="ts">
import { onMounted } from 'vue';
import TableArtist from '@/views/view_music/page_music/page_artist/Table_Artist.vue'
import {store_router_data_info} from "@/router/store_router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'artist'
});

</script>

<template>
  <div class="view_show">
    <TableArtist/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>