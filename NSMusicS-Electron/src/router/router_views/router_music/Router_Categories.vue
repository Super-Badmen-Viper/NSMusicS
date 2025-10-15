<script setup lang="ts">
import { onMounted } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import Table_Categories from '@/views/view_app/page/page_categories/Table_Categories.vue'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server/store_server_users'

onMounted(async () => {
  store_router_data_info.router_select = 'categories'
})
</script>

<template>
  <div class="view_show">
    <!--    <Table_Categories/>-->
    <div
      v-if="
        store_server_user_model.model_server_type_of_web &&
        store_server_users.server_select_kind === 'ninesong'
      "
      style="margin-top: 50px"
    >
      <span style="font-weight: bold; font-size: 24px">
        {{ $t('common.comingSoon') }}
      </span>
    </div>
    <div v-else style="font-size: 24px; font-weight: bold; margin-top: 20px">
      {{ $t('error.serverRequired') + ': NineSong' }}
      <br />
    </div>
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
