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
  try {
    // 1. 初始化数据结构
    store_view_charts_page_info.charts_data_temporary = [
      { type: 'media', name: computed(() => t('entity.track_other')), items: [] },
      { type: 'album', name: computed(() => t('entity.album_other')), items: [] },
      { type: 'artist', name: computed(() => t('entity.artist_other')), items: [] },
      { type: 'media_cue', name: computed(() => t('nsmusics.view_page.disk')), items: [] }
    ];

    // 2. 并行获取所有数据[2](@ref)
    await store_general_fetch_charts_list.fetchData_Charts();

    // 3. 定义统一处理函数
    const processData = (sourceData: any[], targetIndex: number, maxItems = 10) => {
      const addedIds = new Set();
      const result = [];

      // 去重处理[6](@ref)
      for (const row of sourceData.slice(0, 18)) {
        if (!row.id || addedIds.has(row.id)) continue;
        addedIds.add(row.id);
        result.push({
          id: row.id,
          name: row.name ?? row.title,
          play_count: row.play_count,
          rating: row.rating,
          starred: row.favorite,
          play_complete_count: row.play_complete_count,
          play_date: row.play_date
        });
      }

      // 排序并截取
      store_view_charts_page_info.charts_data_temporary[targetIndex].items = result
        .sort((a, b) => b.play_count - a.play_count) // 降序排序
        .slice(0, maxItems);
      store_view_charts_page_info.charts_data_temporary[targetIndex].items.reverse();
    };

    // 4. 并行处理所有数据类型[2](@ref)
    await Promise.all([
      processData(store_view_charts_page_info.charts_media_file_metadata, 0),
      processData(store_view_charts_page_info.charts_album_metadata, 1),
      processData(store_view_charts_page_info.charts_artist_metadata, 2),
      processData(store_view_charts_page_info.charts_media_cue_metadata, 3)
    ]);

  } catch (error) {
    console.error('图表数据加载失败:', error);
  }
});

////// i18n auto lang
import { useThemeVars } from 'naive-ui'
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
    <div style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 16px">
      此页面用于可视化浏览你的播放数据<br />
      它是后续：猜你喜欢(推荐系统)、智能分类、年(季、月、周)度听歌报告 的重要组成部分<br />
      NSMusicS与NineSong的每一个组件，都是通用应用场景组件<br />
      这些组件开发成熟后，就能够轻松集成与互联其它的应用场景(ToC与ToB皆可)<br />
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
