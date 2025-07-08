<script setup lang="ts">
import {shallowRef, ref, computed, watch, onBeforeUnmount} from 'vue';
import { use } from "echarts/core";
import { ScatterChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
} from "echarts/components";
import VChart from 'vue-echarts';
import VExample from "./Example.vue";
import { NSelect, NSpace } from "naive-ui";
import { useI18n } from "vue-i18n";

// 注册ECharts组件
use([
  ScatterChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent
]);

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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
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
    ].sort((a, b) => b.play_count - a.play_count).slice(0, 10)
  }
];
function getData(selectedCategory = "乐曲", theme: 'lightTheme' | 'darkTheme' = 'lightTheme') {
  const category = dimensions.find(d => d.name === selectedCategory);
  if (!category) return {};

  const items = category.items;

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff';
  const axisLineColor = theme === 'lightTheme' ? '#33333380' : '#ffffff80';
  const tooltipBgColor = theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)';
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff';

  const scatterData = items.map(item => {
    const completionRate = Math.round((item.play_complete_count / item.play_count) * 100);

    return {
      name: item.name,
      value: [item.play_count, completionRate, parseFloat(item.rating)],
      play_count: item.play_count,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      play_date: item.play_date,
      completion_rate: completionRate
    };
  });

  return {
    grid: {
      top: "20%",
      right: "12%",
      left: "8%",
      bottom: "5%",
      containLabel: true
    },
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor // 动态文本颜色
    },
    title: {
      text: `${selectedCategory}播放数据分析`,
      top: "5%",
      left: "center",
      textStyle: {
        color: textColor, // 动态文本颜色
        fontSize: 18
      },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBgColor, // 动态提示框背景
      textStyle: {
        color: tooltipTextColor, // 动态提示框文本
        fontSize: 14
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function(params: any) {
        const data = params.data;
        const starStatus = data.starred
            ? '<span style="color:#67C23A;">✓ 已收藏</span>'
            : '<span style="color:#F56C6C;">✗ 未收藏</span>';

        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating));

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${selectedCategory}</div>
            <div>播放次数: ${data.play_count} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${stars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `;
      }
    },
    legend: {
      top: "26px",
      right: "20px",
      data: [selectedCategory],
      textStyle: {
        color: textColor, // 动态文本颜色
        fontSize: 14,
      },
    },
    xAxis: {
      type: "value",
      name: "播放次数",
      nameLocation: "end",
      nameGap: 10,
      axisLabel: {
        formatter: "{value}",
        textStyle: {
          color: textColor, // 动态文本颜色
          fontSize: 12
        },
      },
      nameTextStyle: {
        color: textColor, // 动态文本颜色
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: axisLineColor // 动态轴线颜色
        }
      }
    },
    yAxis: {
      type: "value",
      name: "完播率 (%)",
      nameLocation: "end",
      nameGap: 25,
      axisLabel: {
        formatter: "{value}%",
        textStyle: {
          color: textColor, // 动态文本颜色
          fontSize: 12
        },
      },
      nameTextStyle: {
        color: textColor, // 动态文本颜色
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: axisLineColor // 动态轴线颜色
        }
      }
    },
    visualMap: {
      show: true,
      top: "65px",
      right: "20px",
      seriesIndex: 0,
      dimension: 2,
      min: 0,
      max: 5,
      text: ["高评分", "低评分"],
      calculable: true,
      inRange: {
        color: ["#5470c6", "#91cc75", "#fac858", "#ee6666"]
      },
      textStyle: {
        color: textColor, // 动态文本颜色
      }
    },
    series: [
      {
        name: selectedCategory,
        data: scatterData,
        type: "scatter",
        symbolSize: function(data: any) {
          return 8 + data[2] * 7;
        },
        itemStyle: {
          color: function(params: any) {
            return params.data.starred ? "#ee6666" : "#5470c6";
          },
          borderColor: textColor, // 动态边框颜色
          borderWidth: 0.5,
          shadowBlur: 8,
          shadowColor: "rgba(0, 0, 0, 0.3)",
          shadowOffsetY: 3
        },
        emphasis: {
          label: {
            show: true,
            formatter: "{b}",
            position: "top",
            fontSize: 12,
            padding: [3, 5],
            borderRadius: 4,
          },
          itemStyle: {
            shadowBlur: 12,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            borderWidth: 2
          }
        }
      }
    ]
  };
}

// Vue组件逻辑
const loading = shallowRef(false);
const selectedCategory = ref("乐曲");
const loadingOptions = {
  text: "加载中…",
  color: "#4ea397",
  maskColor: "rgba(255, 255, 255, 0.4)"
};

import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'

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
});
const title = computed(() => t('TabMusic') + t('Play') + t('Sort'));
</script>

<template>
  <v-example id="scatter" title="播放数据分析" desc="散点图：总播放次数 vs 完播率，点大小=评分，颜色=收藏状态">
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
      :loadingOptions="loadingOptions"
    />
    <template #extra>

    </template>
  </v-example>
</template>

<style scoped>

</style>