<script setup lang="ts">
import { onMounted } from 'vue';
import servers from './table/Table_Server_Setting.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'servers'
});
</script>
<template>
  <div class="view_show">
    <servers/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>