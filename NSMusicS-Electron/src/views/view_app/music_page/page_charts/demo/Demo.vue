<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

import BarChart from '@/views/view_app/music_page/page_charts/demo/examples/BarChart.vue'
import PieChart from '@/views/view_app/music_page/page_charts/demo/examples/PieChart.vue'
import PolarChart from '@/views/view_app/music_page/page_charts/demo/examples/PolarChart.vue'
import ScatterChart from '@/views/view_app/music_page/page_charts/demo/examples/ScatterChart.vue'
import { onMounted } from 'vue'
import { store_view_charts_page_info } from '@/views/view_app/music_page/page_charts/store/store_view_charts_page_info'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import { store_general_fetch_charts_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_charts/store_general_fetch_charts_list'
import { store_view_home_page_info } from '@/views/view_app/music_page/page_home/store/store_view_home_page_info'

use([CanvasRenderer, SVGRenderer])

function random() {
  return Math.round(300 + Math.random() * 700) / 10
}
onMounted(async () => {
  store_view_charts_page_info.charts_data_temporary = [
    {
      type: 'media_file',
      name: '乐曲',
      items: [
        {
          name: '七里香',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-07',
        },
        {
          name: '以父之名',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-06',
        },
        {
          name: '晴天',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-05',
        },
        {
          name: '夜曲',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-04',
        },
        {
          name: '青花瓷',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-03',
        },
        {
          name: '稻香',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-02',
        },
        {
          name: '双截棍',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-01',
        },
        {
          name: '简单爱',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-30',
        },
        {
          name: '听妈妈的话',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-29',
        },
        {
          name: '东风破',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-28',
        },
      ]
        .sort((a, b) => a.play_count - b.play_count)
        .slice(0, 10),
    },
    {
      type: 'album',
      name: '专辑',
      items: [
        {
          name: '叶惠美',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-04',
        },
        {
          name: '范特西',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-03',
        },
        {
          name: '十一月的萧邦',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-02',
        },
        {
          name: '七里香',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-01',
        },
        {
          name: '八度空间',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-30',
        },
        {
          name: '我很忙',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-29',
        },
        {
          name: '魔杰座',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-28',
        },
        {
          name: '跨时代',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-27',
        },
        {
          name: '十二新作',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-26',
        },
        {
          name: '哎呦，不错哦',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-25',
        },
      ]
        .sort((a, b) => a.play_count - b.play_count)
        .slice(0, 10),
    },
    {
      type: 'artist',
      name: '艺术家',
      items: [
        {
          name: '周杰伦',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-07-01',
        },
        {
          name: '林俊杰',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-30',
        },
        {
          name: '陈奕迅',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-29',
        },
        {
          name: '邓紫棋',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-28',
        },
        {
          name: '薛之谦',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-27',
        },
        {
          name: '李荣浩',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-26',
        },
        {
          name: '王力宏',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-25',
        },
        {
          name: '张杰',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-24',
        },
        {
          name: '华晨宇',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-23',
        },
        {
          name: '毛不易',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-22',
        },
      ]
        .sort((a, b) => a.play_count - b.play_count)
        .slice(0, 10),
    },
    {
      type: 'media_cue',
      name: '光盘',
      items: [
        {
          name: '经典CD-001',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-28',
        },
        {
          name: '怀旧CD-002',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-27',
        },
        {
          name: '摇滚CD-003',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-26',
        },
        {
          name: '流行CD-004',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-25',
        },
        {
          name: '电子CD-005',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-24',
        },
        {
          name: '爵士CD-006',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-23',
        },
        {
          name: '古典CD-007',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-22',
        },
        {
          name: '民谣CD-008',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-21',
        },
        {
          name: '蓝调CD-009',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-20',
        },
        {
          name: '乡村CD-010',
          play_count: Math.floor(random()),
          rating: (Math.random() * 5).toFixed(1),
          starred: Math.random() > 0.3,
          play_complete_count: Math.floor(random() * 0.8),
          play_date: '2025-06-19',
        },
      ]
        .sort((a, b) => a.play_count - b.play_count)
        .slice(0, 10),
    },
  ]
  ///
  await store_general_fetch_charts_list.fetchData_Charts();
  ///
  store_view_charts_page_info.charts_data_temporary[1].items = [];
  store_view_charts_page_info.charts_album_metadata =
      store_view_home_page_info.home_Files_temporary_maximum_playback;
  // 使用 Set 记录已添加的 ID 实现去重[6,7,8](@ref)
  const addedIds = new Set();
  const loopLength = Math.min(store_view_charts_page_info.charts_album_metadata.length, 8);
  for (let i = 0; i < loopLength; i++) {
    const row = store_view_charts_page_info.charts_album_metadata[i];
    // 跳过重复 ID[6,8](@ref)
    if (addedIds.has(row.id)) continue;
    addedIds.add(row.id); // 记录新 ID
    store_view_charts_page_info.charts_data_temporary[1].items.push({
      id: row.id,
      name: row.name,
      play_count: row.play_count,
      rating: row.rating,
      starred: row.favorite,
      play_complete_count: row.play_complete_count,
      play_date: row.play_date,
    });
  }
  // 排序 + 切片（保留前10条）[6](@ref)
  store_view_charts_page_info.charts_data_temporary[1].items =
      store_view_charts_page_info.charts_data_temporary[1].items
          .sort((a, b) => a.play_count - b.play_count)
          .slice(0, 10);
  ///
})

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})
</script>

<template>
  <div style="margin-left: -20px">
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

<style scoped></style>
