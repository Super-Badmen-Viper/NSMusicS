<script setup lang="ts">
import { shallowRef, ref, computed, watch, onBeforeUnmount } from 'vue'
import { use } from 'echarts/core'
import { ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import VExample from './Example.vue'
import { NSelect, NSpace, NButton } from 'naive-ui'

// 注册ECharts组件
use([
  ScatterChart,
  GridComponent,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
])

// 导入状态管理
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { store_view_charts_page_info } from '@/views/view_app/page/page_charts/store/store_view_charts_page_info'

const selectedCategory = ref('media_file')

function getData(
  selectedCategory = 'media_file',
  theme: 'lightTheme' | 'darkTheme' = 'lightTheme'
) {
  const category = store_view_charts_page_info.charts_data_temporary.find(
    (d) => d.type === selectedCategory
  )
  if (!category) return {}

  const items = category.items

  // 根据主题设置颜色
  const textColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const axisLineColor = theme === 'lightTheme' ? '#33333380' : '#ffffff80'
  const tooltipBgColor =
    theme === 'lightTheme' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 50, 50, 0.9)'
  const tooltipTextColor = theme === 'lightTheme' ? '#333333' : '#ffffff'
  const gridLineColor = theme === 'lightTheme' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'

  const scatterData = items.map((item) => {
    const completionRate = Math.round((item.play_complete_count / item.play_count) * 100)

    return {
      name: item.name,
      value: [item.play_count, completionRate, parseFloat(item.rating)],
      play_count: item.play_count,
      rating: item.rating,
      starred: item.starred,
      play_complete_count: item.play_complete_count,
      play_date: item.play_date,
      completion_rate: completionRate,
    }
  })

  return {
    grid: {
      top: '20%',
      right: '12%',
      left: '8%',
      bottom: '5%',
      containLabel: true,
      backgroundColor: theme === 'lightTheme' ? '#ffffff' : '#1a1a1a', // 动态网格背景
    },
    textStyle: {
      fontWeight: 600,
      fontSize: 14,
      color: textColor, // 动态文本颜色
    },
    title: {
      text: `${category.name}` + t('Play') + t('Data') + t('Categories'),
      top: '5%',
      left: 'center',
      textStyle: {
        color: textColor, // 动态文本颜色
        fontSize: 18,
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
      formatter: function (params: any) {
        const data = params.data
        const starStatus = data.starred
          ? '<span style="color:#67C23A;">✓ 已收藏</span>'
          : '<span style="color:#F56C6C;">✗ 未收藏</span>'

        const ratingValue = parseFloat(data.rating)
        const fullStars = '★'.repeat(Math.floor(ratingValue))
        const emptyStars = '☆'.repeat(5 - Math.ceil(ratingValue))

        return `
          <div style="font-weight:bold;font-size:16px;margin-bottom:8px;">${data.name}</div>
          <div style="display:flex;flex-direction:column;gap:4px;">
            <div>类型: ${category.name}</div>
            <div>播放次数: ${data.play_count} 次</div>
            <div>完整播放: ${data.play_complete_count} 次 (完播率: ${data.completion_rate}%)</div>
            <div>评分: ${data.rating} ${fullStars}${emptyStars}</div>
            <div>收藏状态: ${starStatus}</div>
            <div>最近播放: ${data.play_date}</div>
          </div>
        `
      },
    },
    legend: {
      top: '26px',
      right: '20px',
      data: [selectedCategory],
      textStyle: {
        color: textColor, // 动态文本颜色
        fontSize: 14,
      },
    },
    xAxis: {
      type: 'value',
      name: '播放次数',
      nameLocation: 'end',
      nameGap: 10,
      axisLabel: {
        formatter: '{value}',
        textStyle: {
          color: textColor, // 动态文本颜色
          fontSize: 12,
        },
      },
      nameTextStyle: {
        color: textColor, // 动态文本颜色
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: axisLineColor, // 动态轴线颜色
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '完播率 (%)',
      nameLocation: 'end',
      nameGap: 25,
      axisLabel: {
        formatter: '{value}%',
        textStyle: {
          color: textColor, // 动态文本颜色
          fontSize: 12,
        },
      },
      nameTextStyle: {
        color: textColor, // 动态文本颜色
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: axisLineColor, // 动态轴线颜色
        },
      },
    },
    visualMap: {
      show: true,
      top: '65px',
      right: '20px',
      seriesIndex: 0,
      dimension: 2,
      min: 0,
      max: 5,
      text: ['高评分', '低评分'],
      calculable: true,
      inRange: {
        color: ['#5470c6', '#91cc75', '#fac858', '#ee6666'],
      },
      textStyle: {
        color: textColor, // 动态文本颜色
      },
    },
    series: [
      {
        name: selectedCategory,
        data: scatterData,
        type: 'scatter',
        symbolSize: function (data: any) {
          return 10 + data[2] * 8 // 根据评分调整点的大小[1](@ref)
        },
        itemStyle: {
          color: function (params: any) {
            return params.data.starred ? '#ee6666' : '#5470c6'
          },
          borderColor: textColor, // 动态边框颜色
          borderWidth: 0.5,
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffsetY: 3,
        },
        emphasis: {
          label: {
            show: true,
            formatter: '{b}',
            position: 'top',
            fontSize: 12,
            padding: [3, 5],
            borderRadius: 4,
          },
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
          },
        },
      },
    ],
  }
}

// Vue组件逻辑
const loading = shallowRef(false)
const loadingOptions = {
  text: '加载中…',
  color: '#4ea397',
  maskColor: 'rgba(255, 255, 255, 0.4)',
}

const option = shallowRef(getData(selectedCategory.value, store_app_configs_info.theme_name))

const dimensionOptions = computed(() => {
  return store_view_charts_page_info.charts_data_temporary.map((dim) => ({
    label: dim.name,
    value: dim.type,
  }))
})

// 主题变化监听器
let unwatch_theme_name = watch(
  () => store_app_configs_info.theme_name,
  (newTheme) => {
    loading.value = true
    option.value = getData(selectedCategory.value, newTheme)
    loading.value = false
  }
)

// 新增：图表数据变化监听器
let unwatch_charts_data = watch(
  () => store_view_charts_page_info.charts_data_temporary,
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
    option.value = getData(selectedCategory.value, store_app_configs_info.theme_name)
    loading.value = false
  },
  { deep: true } // 深度监听，确保数组内部变化也能触发更新
)

// 分类切换处理
function handleCategoryChange(newCategory: string) {
  loading.value = true
  option.value = getData(newCategory, store_app_configs_info.theme_name)
  loading.value = false
}

// 刷新数据
async function refresh() {
  loading.value = true
  await store_view_charts_page_logic.fetchData_Charts()
  option.value = getData(selectedCategory.value, store_app_configs_info.theme_name)
  loading.value = false
}

// 清理监听器
onBeforeUnmount(() => {
  unwatch_theme_name()
  unwatch_charts_data() // 清理图表数据监听器
})

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import { store_view_charts_page_logic } from '@/views/view_app/page/page_charts/store/store_view_charts_page_logic'
const { t } = useI18n({
  inheritLocale: true,
})
const title = computed(() => t('TabMusic') + t('Play') + t('Sort'))
</script>

<template>
  <v-example id="scatter" :title="title" desc="散点图：总播放次数 vs 完播率，点大小-颜色=评分">
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
