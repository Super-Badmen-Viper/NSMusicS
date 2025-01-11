<script setup lang="ts">
import { onMounted } from 'vue';
import library from './table/Table_Server_Library.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'library'
});
</script>
<template>
  <div class="view_show">
    <library/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>