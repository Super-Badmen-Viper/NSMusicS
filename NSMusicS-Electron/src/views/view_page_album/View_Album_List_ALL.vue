<script setup lang="ts">
import { onMounted } from 'vue';
import Table_Album_List_ALL from './table/Table_Album_List_ALL_Grid_Virtual.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'View_Album_List_ALL'
});

</script>

<template>
  <div class="view_show">
    <Table_Album_List_ALL/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>