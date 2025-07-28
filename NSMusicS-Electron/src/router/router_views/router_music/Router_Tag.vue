<script setup lang="ts">
import { onMounted } from 'vue'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import Table_Tag from '@/views/view_app/music_page/page_tag/Table_Tag.vue'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

onMounted(async () => {
  store_router_data_info.router_select = 'tag'
})
</script>

<template>
  <div class="view_show">
    <Table_Tag />
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
