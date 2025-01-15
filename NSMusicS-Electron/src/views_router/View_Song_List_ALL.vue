<script setup lang="ts">
import { onMounted } from 'vue';
import Table_Song_List from '@/views/view_page_media/Table_Song_List_ALL_Line_Virtual.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'song'
});
</script>

<template>
  <div class="view_show">
    <Table_Song_List/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>