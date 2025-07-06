<script setup lang="ts">
import { onMounted } from 'vue';
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import Table_Categories from "@/views/view_app/music_page/page_categories/Table_Categories.vue";

onMounted(async () => {
  store_router_data_info.router_select = 'categories'
});
</script>

<template>
  <div class="view_show">
    <Table_Categories/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
}
</style>