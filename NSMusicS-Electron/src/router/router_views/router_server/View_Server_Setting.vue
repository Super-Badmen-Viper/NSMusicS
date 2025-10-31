<script setup lang="ts">
import { onMounted } from 'vue'
import setting from '@/views/view_setting/Table_All_Setting.vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'

onMounted(async () => {
  store_router_data_info.router_select = 'setting'
  store_router_data_info.router_name = 'setting'
})
</script>
<template>
  <div class="view_show">
    <setting />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>