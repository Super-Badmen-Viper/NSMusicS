<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

import BarChart from '@/views/view_app/page/page_charts/demo/examples/BarChart.vue'
import PieChart from '@/views/view_app/page/page_charts/demo/examples/PieChart.vue'
import PolarChart from '@/views/view_app/page/page_charts/demo/examples/PolarChart.vue'
import ScatterChart from '@/views/view_app/page/page_charts/demo/examples/ScatterChart.vue'
import { computed, onMounted } from 'vue'
import { usePageChartsStore } from '@/data/data_status/app_status/page_status/charts_store/usePageChartsStore'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'

const pageChartsStore = usePageChartsStore()

use([CanvasRenderer, SVGRenderer])

import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

onMounted(async () => {
  pageChartsStore.charts_data_temporary = [
    { type: 'media', name: computed(() => t('entity.track_other')), items: [] },
    { type: 'album', name: computed(() => t('entity.album_other')), items: [] },
    { type: 'artist', name: computed(() => t('entity.artist_other')), items: [] },
    { type: 'media_cue', name: computed(() => 'CUE ' + t('nsmusics.view_page.disk')), items: [] },
  ]
  await pageChartsStore.init_Load_Charts()
})

import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
</script>

<template>
  <div class="home-wall-container">
    <!--    <logo-chart />-->
    <div style="text-align: center; font-weight: bold; font-size: 26px; margin-bottom: 10px">
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
