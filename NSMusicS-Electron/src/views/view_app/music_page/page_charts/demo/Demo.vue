<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

import BarChart from '@/views/view_app/music_page/page_charts/demo/examples/BarChart.vue'
import PieChart from '@/views/view_app/music_page/page_charts/demo/examples/PieChart.vue'
import PolarChart from '@/views/view_app/music_page/page_charts/demo/examples/PolarChart.vue'
import ScatterChart from '@/views/view_app/music_page/page_charts/demo/examples/ScatterChart.vue'
import { computed, onMounted } from 'vue'
import { store_view_charts_page_info } from '@/views/view_app/music_page/page_charts/store/store_view_charts_page_info'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import { store_general_fetch_charts_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_charts/store_general_fetch_charts_list'

use([CanvasRenderer, SVGRenderer])

function random() {
  return Math.round(300 + Math.random() * 700) / 10
}

import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

onMounted(async () => {
  // 1. 初始化数据结构
  store_view_charts_page_info.charts_data_temporary = [
    { type: 'media', name: computed(() => t('entity.track_other')), items: [] },
    { type: 'album', name: computed(() => t('entity.album_other')), items: [] },
    { type: 'artist', name: computed(() => t('entity.artist_other')), items: [] },
    { type: 'media_cue', name: computed(() => t('nsmusics.view_page.disk')), items: [] },
  ]
  //
  await store_view_charts_page_logic.fetchData_Charts()
})

////// i18n auto lang
import { useThemeVars } from 'naive-ui'
import { store_view_charts_page_logic } from '@/views/view_app/music_page/page_charts/store/store_view_charts_page_logic'
const themeVars = useThemeVars()
</script>

<template>
  <div class="home-wall-container">
    <!--    <logo-chart />-->
    <div style="text-align: center; font-weight: bold; font-size: 32px; margin-bottom: 10px">
      Vue-ECharts
      <span
        v-if="
          (store_server_user_model.model_server_type_of_web &&
            store_server_users.server_select_kind != 'ninesong') ||
          store_server_user_model.model_server_type_of_local
        "
        style="color: crimson; font-weight: 600"
      >
        {{ ' | ' + $t('error.serverRequired') + ': NineSong' }}
        <br />
      </span>
    </div>

    <bar-chart />
    <pie-chart />
    <polar-chart />
    <scatter-chart />
    <!--    <geo-chart />-->
    <!--    <radar-chart />-->
    <!--    <connect-chart />-->
    <!--    <gl-chart />-->
    <!--    <manual-chart />-->
    <br />
  </div>
</template>

<style scoped>
.home-wall-container {
  width: 100%;
  height: 100%;
  padding-right: 20px;
  overflow-x: hidden;
  overflow-y: scroll;

  --card-color: v-bind('themeVars.cardColor');
  --border-color: v-bind('themeVars.borderColor');
  --primary-color-hover: v-bind('themeVars.primaryColorHover');
  --primary-color-suppl: v-bind('themeVars.primaryColorSuppl');
  --text-color-1: v-bind('themeVars.textColor1');
  --text-color-2: v-bind('themeVars.textColor2');
  --text-color-3: v-bind('themeVars.textColor3');
  --hover-color: v-bind('themeVars.hoverColor');
  --scrollbar-color: v-bind('themeVars.scrollbarColor');
  --scrollbar-color-hover: v-bind('themeVars.scrollbarColorHover');
}
</style>
