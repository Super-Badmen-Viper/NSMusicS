<script setup lang="ts">
import { use, registerTheme } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, DatasetComponent } from "echarts/components";
import { shallowRef, ref, computed } from "vue";
import VChart from 'vue-echarts';
import VExample from "./Example.vue";
import theme from "../theme.json";
import { NSelect } from 'naive-ui';
import {useI18n} from "vue-i18n";

use([BarChart, DatasetComponent, GridComponent]);
registerTheme("ovilia-green", theme);

// 随机数据生成函数
function random() {
  return Math.round(300 + Math.random() * 700) / 10;
}
const dimensions = [
  {
    type: "media_file",
    name: "乐曲",
    items: [
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-07" },
      { name: "以父之名", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-06" },
      { name: "晴天", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-05" },
      { name: "夜曲", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "青花瓷", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "稻香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "双截棍", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "简单爱", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "听妈妈的话", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "东风破", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" }
    ].sort((a, b) => a.play_count - b.play_count).slice(0, 10)
  },
  {
    type: "album",
    name: "专辑",
    items: [
      { name: "叶惠美", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-04" },
      { name: "范特西", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-03" },
      { name: "十一月的萧邦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-02" },
      { name: "七里香", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "八度空间", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "我很忙", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "魔杰座", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "跨时代", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "十二新作", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "哎呦，不错哦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" }
    ].sort((a, b) => a.play_count - b.play_count).slice(0, 10)
  },
  {
    type: "artist",
    name: "艺术家",
    items: [
      { name: "周杰伦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-07-01" },
      { name: "林俊杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-30" },
      { name: "陈奕迅", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-29" },
      { name: "邓紫棋", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "薛之谦", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "李荣浩", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "王力宏", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
      { name: "张杰", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
      { name: "华晨宇", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
      { name: "毛不易", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" }
    ].sort((a, b) => a.play_count - b.play_count).slice(0, 10)
  },
  {
    type: "media_cue",
    name: "光盘",
    items: [
      { name: "经典CD-001", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-28" },
      { name: "怀旧CD-002", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-27" },
      { name: "摇滚CD-003", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-26" },
      { name: "流行CD-004", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-25" },
      { name: "电子CD-005", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-24" },
      { name: "爵士CD-006", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-23" },
      { name: "古典CD-007", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-22" },
      { name: "民谣CD-008", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-21" },
      { name: "蓝调CD-009", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-20" },
      { name: "乡村CD-010", play_count: Math.floor(random()), rating: (Math.random() * 5).toFixed(1), starred: Math.random() > 0.3, play_complete_count: Math.floor(random() * 0.8), play_date: "2025-06-19" }
    ].sort((a, b) => a.play_count - b.play_count).slice(0, 10)
  }
];

import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'

const selectedCategory = ref("乐曲");

function getData(selectedCategory = "乐曲", theme: 'lightTheme' | 'darkTheme' = 'lightTheme') {
  // 获取选中的维度数据
  const category = dimensions.find(d => d.name === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const axisLineColor = theme === 'lightTheme' ? '#666666' : '#aaaaaa';
  const tooltipBgColor = theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)';
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const gridLineColor = theme === 'lightTheme' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

  // 准备图表数据
  const yAxisData = [];
  const playCountData = [];
  const ratingData = [];
  const categoryMap = {};

  items.forEach(item => {
    yAxisData.push(item.name);
    playCountData.push(item.play_count);
    ratingData.push(item.rating);

    // 存储额外数据供tooltip使用
    categoryMap[item.name] = {
      category: category.name,
      item: item.name,
      play_date: item.play_date,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      completion_rate: Math.round((item.play_complete_count / item.play_count) * 100)
    };
  });

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor // 动态文本颜色
    },
    title: {
      text: `${selectedCategory}播放排名`,
      top: "5%",
      left: "center",
      textStyle: {
        color: textColor // 动态标题颜色
      }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBgColor, // 动态提示框背景
      textStyle: {
        color: tooltipTextColor, // 动态提示框文本
        fontSize: 14
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function(params) {
        const data = categoryMap[params.name];
        const starStatus = data.starred
            ? '<span style="color:#67C23A;">✓ 已收藏</span>'
            : '<span style="color:#F56C6C;">✗ 未收藏</span>';

        // 生成星级评分（1-5星）
        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating));

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.item}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${data.category}</div>
            <div>播放次数: ${params.value} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
      backgroundColor: theme === 'lightTheme' ? '#ffffff' : '#1a1a1a', // 动态网格背景
      borderColor: gridLineColor // 动态网格线颜色
    },
    xAxis: {
      type: 'value',
      name: '播放次数',
      nameLocation: 'end',
      nameTextStyle: {
        padding: [0, 0, 0, 20],
        color: textColor // 动态坐标轴名称颜色
      },
      axisLine: {
        lineStyle: {
          color: axisLineColor // 动态轴线颜色
        }
      },
      axisLabel: {
        color: textColor // 动态标签颜色
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor // 动态分割线颜色
        }
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisLine: {
        lineStyle: {
          color: axisLineColor // 动态轴线颜色
        }
      },
      axisLabel: {
        interval: 0,
        fontSize: 12,
        color: textColor, // 动态标签颜色
        formatter: function(value) {
          return value;
        }
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor // 动态分割线颜色
        }
      }
    },
    series: [
      {
        name: '播放次数',
        type: 'bar',
        data: playCountData,
        itemStyle: {
          color: function(params) {
            // 根据完播率生成渐变色
            const completionRate = categoryMap[yAxisData[params.dataIndex]].completion_rate;
            return completionRate > 80 ?
                'hsl(160, 100%, 37%)' :
                completionRate > 60 ?
                    'hsl(40, 100%, 50%)' :
                    'hsl(0, 100%, 45%)';
          },
          borderRadius: [0, 16, 16, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: textColor, // 动态标签颜色
          formatter: function(params) {
            const rating = categoryMap[params.name].rating;
            return `${params.value}次 (${rating}★)`;
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: theme === 'lightTheme'
                ? 'rgba(0,0,0,0.3)'
                : 'rgba(255,255,255,0.3)', // 动态阴影颜色
            borderWidth: 1,
            borderColor: theme === 'lightTheme' ? '#fff' : '#333' // 动态边框颜色
          }
        }
      },
      {
        name: '评分',
        type: 'scatter',
        yAxisIndex: 0,
        symbolSize: function(value) {
          // 根据评分决定点的大小
          return Math.max(8, value * 4);
        },
        data: ratingData.map((rating, index) => {
          return {
            value: [playCountData[index] * 1.05, yAxisData[index]],
            rating: rating
          };
        }),
        itemStyle: {
          color: function(params) {
            // 根据评分生成颜色
            const rating = params.data.rating;
            return rating > 4 ?
                'hsl(210, 100%, 56%)' :
                rating > 3 ?
                    'hsl(160, 100%, 37%)' :
                    rating > 2 ?
                        'hsl(40, 100%, 50%)' :
                        'hsl(0, 100%, 45%)';
          }
        },
        label: {
          show: false
        }
      }
    ]
  };
}

const loading = shallowRef(false);
const loadingOptions = {
  text: "加载中…",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.4)"
};

// 使用响应式图表配置
const option = shallowRef(getData(selectedCategory.value, store_app_configs_info.theme_name));

const dimensionOptions = computed(() => {
  return dimensions.map(dim => ({
    label: dim.name,
    value: dim.name
  }));
});

// 主题变化监听器
let unwatch_theme_name = watch(
    () => store_app_configs_info.theme_name,
    (newTheme) => {
      loading.value = true;
      option.value = getData(selectedCategory.value, newTheme);
      loading.value = false;
    }
);

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true;
  option.value = getData(newCategory, store_app_configs_info.theme_name);
  loading.value = false;
}

// 刷新数据
function refresh() {
  loading.value = true;
  setTimeout(() => {
    option.value = getData(selectedCategory.value, store_app_configs_info.theme_name);
    loading.value = false;
  }, 300);
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name();
});

const { t } = useI18n({
  inheritLocale: true
})
const title = computed(() => t('TabMusic') + t('Play') + t('Sort'));
</script>

<template>
  <v-example id="bar" :title="title" desc="柱状图：展示播放次数排名">
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0;">
        <n-select
            v-model:value="selectedCategory"
            :options="dimensionOptions"
            style="width: 160px;"
            @update:value="handleCategoryChange"
        />
      </n-space>
    </template>
    <v-chart
        :option="option"
        autoresize
        :loading="loading"
        :loading-options="loadingOptions"
    />
  </v-example>
</template>

<style scoped>

</style>
