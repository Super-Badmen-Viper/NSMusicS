<script setup lang="ts">
import { onMounted } from 'vue';
import Table_Media_List from '@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media_cue/Table_Media_Cue.vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

onMounted(async () => {
  store_router_data_info.router_select = 'media_cue'
});
</script>

<template>
  <div class="view_show">
    <Table_Media_List
        v-if="store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong'"
    />
    <div v-else style="font-size: 24px;font-weight: bold;margin-top: 20px;">
      {{ $t('nsmusics.view_page.current') + $t('LabelWeb') + ': ' + $t('nsmusics.view_page.disk') + $t('List') + ' ( CUE ' + $t('nsmusics.view_page.disk') + $t('nsmusics.view_page.virtual_orbit_division')+ $t('List') + ' ) '}}
      <br>
      {{ $t('error.serverRequired') + ': NineSong' }}
      <br>
      <br>
      {{ 'CUE ' + $t('nsmusics.view_page.disk') + $t('nsmusics.view_page.virtual_orbit_division') + ' ' + $t('AudioProfileNotSupported') + ': Navidrome、Jellyfin、Emby' }}
      <br>
      {{ $t('SelectServer')  + ': NineSong' }}
      <br>
    </div>
  </div>
</template>

<style>
.view_show {
  width: 100vw;
  height: calc(100vh - 200px);
}
</style>