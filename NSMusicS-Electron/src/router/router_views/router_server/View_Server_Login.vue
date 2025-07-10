<script setup lang="ts">
import { onMounted } from 'vue'
import login from '@/views/view_server/page_login/Table_Server_Login.vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'

onMounted(async () => {
  store_router_data_info.router_select = 'login'
})
</script>
<template>
  <div class="view_show">
    <login />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
