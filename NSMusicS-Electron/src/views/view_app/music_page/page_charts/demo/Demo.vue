<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

import BarChart from '@/views/view_app/music_page/page_charts/demo/examples/BarChart.vue'
import PieChart from '@/views/view_app/music_page/page_charts/demo/examples/PieChart.vue'
import PolarChart from '@/views/view_app/music_page/page_charts/demo/examples/PolarChart.vue'
import ScatterChart from '@/views/view_app/music_page/page_charts/demo/examples/ScatterChart.vue'
import { onMounted } from 'vue'
import { store_view_charts_page_info } from '@/views/view_app/music_page/page_charts/store/store_view_charts_page_info'

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
  // ///
  // await store_general_fetch_charts_list.fetchData_Charts();
  // ///
  // store_view_charts_page_info.charts_data_temporary[1].items = [];
  // store_view_charts_page_info.charts_album_metadata =
  //     store_view_home_page_info.home_Files_temporary_maximum_playback;
  // // 使用 Set 记录已添加的 ID 实现去重[6,7,8](@ref)
  // const addedIds = new Set();
  // const loopLength = Math.min(store_view_charts_page_info.charts_album_metadata.length, 8);
  // for (let i = 0; i < loopLength; i++) {
  //   const row = store_view_charts_page_info.charts_album_metadata[i];
  //   // 跳过重复 ID[6,8](@ref)
  //   if (addedIds.has(row.id)) continue;
  //   addedIds.add(row.id); // 记录新 ID
  //   store_view_charts_page_info.charts_data_temporary[1].items.push({
  //     id: row.id,
  //     name: row.name,
  //     play_count: row.play_count,
  //     rating: row.rating,
  //     starred: row.favorite,
  //     play_complete_count: row.play_complete_count,
  //     play_date: row.play_date,
  //   });
  // }
  // // 排序 + 切片（保留前10条）[6](@ref)
  // store_view_charts_page_info.charts_data_temporary[1].items =
  //     store_view_charts_page_info.charts_data_temporary[1].items
  //         .sort((a, b) => a.play_count - b.play_count)
  //         .slice(0, 10);
  // ///
})
</script>

<template>
  <div style="margin-left: -20px">
    <!--    <logo-chart />-->

    <div style="text-align: center; font-weight: bold; font-size: 32px; margin-bottom: 10px">
      Vue-ECharts
    </div>
    <div style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 16px">
      此页面用于可视化浏览你的播放数据<br />
      它是后续：猜你喜欢(推荐系统)与年(季、月、周)度听歌报告 的重要组成部分<br />
      NSMusicS与NineSong的每一个组件，都是通用应用场景组件<br />
      这些组件成熟后，就能够轻松集成互联其它应用场景(ToC与ToB皆可)<br />
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
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 3em 0 0;
  font-family: Inter, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  color: #666;
  text-align: center;
}

a {
  color: inherit;
  text-decoration: none;
  box-shadow: 0 1px 0 0 #42b983;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 0 0 #42b983;
  }
}

h1,
h2,
h3 {
  color: #2c3e50;
  font-weight: 400;
}

h1 {
  margin-bottom: 1em;
  font-family: Inter, 'Helvetica Neue', Arial, sans-serif;
}

h2 {
  margin-top: 1em;
  margin-bottom: 1em;
}

.sep {
  margin-top: 6em;
  margin-bottom: 1.8em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 1.25em;
  color: #7f8c8d;
  opacity: 0.6;

  &::before,
  &::after {
    content: '';
    display: block;
    width: 48px;
    border-bottom: 1px dotted currentColor;
  }
}

h3 {
  margin-top: 2em;
  padding-top: 1em;
  font-size: 1.2em;

  small {
    font-weight: 300;
    opacity: 0.7;
  }

  button {
    margin-left: 1em;
    vertical-align: middle;
  }
}

.desc {
  margin-bottom: 3em;
  color: #7f8c8d;

  a {
    color: #42b983;
  }
}

p small {
  font-size: 0.8em;
  color: #7f8c8d;
}

p {
  line-height: 1.5;

  button + button,
  button + select,
  select + button,
  select + select {
    margin-left: 0.5em;
  }
}

pre {
  display: inline-block;
  padding: 0.8em;
  background-color: #f9f9f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.125);
  text-align: left;
}
pre,
code,
textarea {
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
}

footer {
  margin: 5em 0 3em;
  font-size: 0.5em;
  vertical-align: middle;

  a {
    display: inline-block;
    margin: 0 5px;
    color: #7f8c8d;
    font-size: 2em;
  }
}

h1,
h2,
h3 {
  a,
  a:hover {
    text-decoration: none;
    box-shadow: none;
  }
}

button,
select,
input {
  border: 1px solid #4fc08d;
  border-radius: 0.5em;
  background-color: #fff;
  color: #42b983;
  cursor: pointer;
  font: inherit;
  padding: 0 0.5em;
  transition: all 0.2s;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    box-shadow: 0 0 1px #4fc08d;
  }

  &:active {
    background: rgba(79, 192, 141, 0.2);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

button,
input,
label,
select {
  font-size: 0.75em;
  height: 2em;
}

#logo {
  display: inline-flex;
  width: 128px;
  height: 128px;
  pointer-events: none;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 2147483646;

  &.open {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    position: absolute;
    background-color: #404a59;
    max-width: 80vw;
    border: 2px solid #fff;
    border-radius: 3px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 980px) {
  p {
    select {
      text-indent: calc(50% - 1em);
    }

    select,
    label {
      border: 1px solid #4fc08d;
      border-radius: 2em;
      background-color: #fff;
      color: #42b983;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    button,
    input,
    select,
    label {
      flex: 1 0;
      margin: 0 0.5em;
      padding: 0;
      line-height: 2em;
      max-width: 40vw;
      border-radius: 0.5em;
      font-size: 0.8em;
    }

    input[type='checkbox'] {
      display: none;

      &:checked + label {
        background: #42b983;
        color: #fff;
      }
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.renderer,
.codegen {
  button {
    position: relative;
    border-color: #36485e;
    color: rgba(54, 72, 94, 0.8);
    font-weight: 500;

    &:focus-visible {
      box-shadow: 0 0 1px #36485e;
    }

    &:active {
      background: rgba(54, 72, 94, 0.2);
    }
  }
}

.renderer {
  position: fixed;
  top: 10px;
  left: 10px;
  font-size: 16px;

  button {
    width: 64px;

    &.active {
      z-index: 1;
      background-color: #36485e;
      color: #fff;
    }

    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:last-child {
      left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}

.codegen {
  display: flex;
  position: fixed;
  top: 10px;
  left: 146px;

  button {
    display: flex;
    align-items: center;
    padding: 0 4px;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .codegen {
    display: none;
  }
}
</style>
