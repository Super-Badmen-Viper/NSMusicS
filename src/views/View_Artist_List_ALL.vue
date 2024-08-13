<script setup lang="ts">
import { onMounted,defineEmits } from 'vue';
import Table_Artist_List_ALL from '../views/table/Table_Artist_List_ALL_Grid_Virtual.vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";

onMounted(async () => {
  store_router_data_info.router_select = 'View_Artist_List_ALL'
});

const emits = defineEmits([
  'artist_page_num',
  'artist_page_size',
]);
</script>

<template>
  <div class="view_show">
    <Table_Artist_List_ALL/>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>