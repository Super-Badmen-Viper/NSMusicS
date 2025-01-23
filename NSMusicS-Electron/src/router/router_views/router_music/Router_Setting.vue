<script setup lang="ts">
import { onMounted } from 'vue';
import TableSetting from '@/views/view_music/music_page/page_setting/Table_Setting.vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'apps'
});
</script>
<template>
  <div class="view_show">
    <TableSetting/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>