<script setup lang="ts">
import { onMounted } from 'vue'
import Table_Media_List from '@/views/view_app/music_page/page_media/Table_Media.vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'

onMounted(async () => {
  store_router_data_info.router_select = 'media'
})
</script>

<template>
  <div class="view_show">
    <Table_Media_List />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
