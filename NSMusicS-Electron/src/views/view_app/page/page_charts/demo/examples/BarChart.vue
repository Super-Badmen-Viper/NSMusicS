<script setup lang="ts">
import { use } from 'echarts/core'
import { BarChart, ScatterChart } from 'echarts/charts'
import { GridComponent, DatasetComponent } from 'echarts/components'
import { shallowRef, ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import VChart from 'vue-echarts'
import VExample from './Example.vue'
import { NSelect, NSpace } from 'naive-ui'

use([BarChart, ScatterChart, DatasetComponent, GridComponent])

import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePageChartsStore } from '@/data/data_status/app_status/page_status/charts_store/usePageChartsStore'
import { store_general_fetch_charts_list } from '@/server/server_api_store/server_api_core/page/page_charts/store_general_fetch_charts_list'

const pageChartsStore = usePageChartsStore()

const selectedCategory = ref('media_file')

// 颜色插值辅助函数
function interpolateColor(color1, color2, factor) {
  // 将十六进制颜色转换为RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  // 将RGB转换为十六进制
  const rgbToHex = (r, g, b) => `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`

  const [r1, g1, b1] = hexToRgb(color1)
  const [r2, g2, b2] = hexToRgb(color2)

  // 计算中间值
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)

  return rgbToHex(r, g, b)
}

function getData(
  selectedCategory = 'media_file',
  theme: 'lightTheme' | 'darkTheme' = 'lightTheme'
) {
  // 获取选中的维度数据
  const category = pageChartsStore.charts_data_temporary.find((d) => d.type === selectedCategory)
  if (!category) return {}

  const items = category.items

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const axisLineColor = theme === 'lightTheme' ? '#666666' : '#aaaaaa'
  const tooltipBgColor =
    theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)'
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const gridLineColor = theme === 'lightTheme' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'

  // 准备图表数据
  const yAxisData = []
  const playCountData = []
  const ratingData = []
  const categoryMap = {}

  items.forEach((item) => {
    yAxisData.push(item.name)
    playCountData.push(item.play_count)
    ratingData.push(item.rating)

    // 存储额外数据供tooltip使用
    categoryMap[item.name] = {
      category: category.name,
      item: item.name,
      play_date: item.play_date,
      rating: item.rating,
      starred: item.starred,
      play_count: item.play_count,
      play_complete_count: item.play_complete_count,
      completion_rate: Math.round((item.play_complete_count / item.play_count) * 100),
    }
  })

  return {
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor, // 动态文本颜色
    },
    title: {
      text: `${category.name}` + t('Play') + t('Sort'),
      top: '5%',
      left: 'center',
      textStyle: {
        color: textColor, // 动态标题颜色
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBgColor, // 动态提示框背景
      textStyle: {
        color: tooltipTextColor, // 动态提示框文本
        fontSize: 14,
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      formatter: function (params) {
        const data = categoryMap[params.name]
        const starStatus = data.starred
          ? '<span style="color:#67C23A;">✓ 已收藏</span>'
          : '<span style="color:#F56C6C;">✗ 未收藏</span>'

        // 生成星级评分（1-5星）
        const stars = '★'.repeat(Math.floor(data.rating)) + '☆'.repeat(5 - Math.floor(data.rating))

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
        `
      },
    },
    grid: {
      left: '5%',
      right: '15%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
      backgroundColor: theme === 'lightTheme' ? '#ffffff' : '#1a1a1a', // 动态网格背景
      borderColor: gridLineColor, // 动态网格线颜色
    },
    xAxis: {
      type: 'value',
      name: '播放次数',
      nameLocation: 'end',
      nameTextStyle: {
        padding: [0, 0, 0, 20],
        color: textColor, // 动态坐标轴名称颜色
      },
      axisLine: {
        lineStyle: {
          color: axisLineColor, // 动态轴线颜色
        },
      },
      axisLabel: {
        color: textColor, // 动态标签颜色
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor, // 动态分割线颜色
        },
      },
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisLine: {
        lineStyle: {
          color: axisLineColor, // 动态轴线颜色
        },
      },
      axisLabel: {
        interval: 0,
        fontSize: 12,
        color: textColor, // 动态标签颜色
        formatter: function (value) {
          return value
        },
      },
      splitLine: {
        lineStyle: {
          color: gridLineColor, // 动态分割线颜色
        },
      },
    },
    series: [
      {
        name: '播放次数',
        type: 'bar',
        data: playCountData,
        itemStyle: {
          color: function (params) {
            const play_count = categoryMap[yAxisData[params.dataIndex]].play_count
            const minPlayCount = Math.min(...playCountData)
            const maxPlayCount = Math.max(...playCountData)
            const ratio =
              maxPlayCount === minPlayCount
                ? 0.5
                : (play_count - minPlayCount) / (maxPlayCount - minPlayCount)

            // 新三色渐变：青绿(#2ecc71) → 浓青(#3498db) → 橙红(#ff7c5b)
            if (ratio >= 0.66) {
              // 高值区间：浓青→橙红渐变（ratio: 0.66~1.0）
              const t = (ratio - 0.66) / 0.34
              return interpolateColor('#3498db', '#ff7c5b', t)
            } else if (ratio >= 0.33) {
              // 中值区间：青绿→浓青渐变（ratio: 0.33~0.66）
              const t = (ratio - 0.33) / 0.33
              return interpolateColor('#2ecc71', '#3498db', t)
            } else {
              return '#2ecc71' // 低值区间：青绿色
            }
          },
          borderRadius: [0, 16, 16, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: textColor, // 动态标签颜色
          formatter: function (params) {
            const rating = categoryMap[params.name].rating
            return `${params.value}次 (${rating}★)`
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: theme === 'lightTheme' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', // 动态阴影颜色
            borderWidth: 1,
            borderColor: theme === 'lightTheme' ? '#fff' : '#333', // 动态边框颜色
          },
        },
      },
      {
        name: '评分',
        type: 'scatter',
        yAxisIndex: 0,
        symbolSize: function (value) {
          // 根据评分决定点的大小
          return Math.max(8, value * 4)
        },
        data: ratingData.map((rating, index) => {
          return {
            value: [playCountData[index] * 1.05, yAxisData[index]],
            rating: rating,
          }
        }),
        label: {
          show: false,
        },
      },
    ],
  }
}

const loading = shallowRef(false)
const loadingOptions = {
  text: '加载中…',
  color: '#4ea397',
  maskColor: 'rgba(255, 255, 255, 0.4)',
}

// 使用响应式图表配置
const option = shallowRef(getData(selectedCategory.value, store_system_configs_info.theme_name))

const dimensionOptions = computed(() => {
  return pageChartsStore.charts_data_temporary.map((dim) => ({
    label: dim.name,
    value: dim.type,
  }))
})

// 主题变化监听器
let unwatch_theme_name = watch(
  () => store_system_configs_info.theme_name,
  (newTheme) => {
    loading.value = true
    option.value = getData(selectedCategory.value, newTheme)
    loading.value = false
  }
)

// 新增：图表数据变化监听器
let unwatch_charts_data = watch(
  () => pageChartsStore.charts_data_temporary,
  (newData) => {
    // 检查当前选中的分类是否在新数据中存在
    const currentCategory = selectedCategory.value
    const categoryExists = newData.some((d) => d.type === currentCategory)

    if (!categoryExists && newData.length > 0) {
      // 如果当前选中的分类不存在，则选择第一个分类
      selectedCategory.value = newData[0].type
    }

    // 更新图表
    loading.value = true
    option.value = getData(selectedCategory.value, store_system_configs_info.theme_name)
    loading.value = false
  },
  { deep: true } // 深度监听，确保数组内部变化也能触发更新
)

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true
  option.value = getData(newCategory, store_system_configs_info.theme_name)
  loading.value = false
}

// 刷新数据
async function refresh() {
  loading.value = true
  await store_general_fetch_charts_list.fetchData_Charts()
  option.value = getData(selectedCategory.value, store_system_configs_info.theme_name)
  loading.value = false
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name()
  unwatch_charts_data() // 新增：清理图表数据监听器
})

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})
const title = computed(() => t('TabMusic') + t('Play') + t('Sort'))
</script>

<template>
  <v-example id="bar" :title="title" desc="柱状图：展示播放次数排名">
    <template #head>
      <n-space style="width: 100%; justify-content: center; margin: 10px 0">
        <n-select
          v-model:value="selectedCategory"
          :options="dimensionOptions"
          style="width: 160px"
          @update:value="handleCategoryChange"
        />
        <n-button @click="refresh" type="primary">刷新数据</n-button>
      </n-space>
    </template>
    <v-chart :option="option" autoresize :loading="loading" :loading-options="loadingOptions" />
  </v-example>
</template>

<style scoped></style>
