<script setup lang="ts">
import { onMounted } from 'vue'
import Table_Media_List from '@/views/view_app/page/page_media_cue/Table_Media_Cue.vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

onMounted(async () => {
  store_router_data_info.router_select = 'media_cue'
})
</script>

<template>
  <div class="view_show">
    <Table_Media_List />
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>
