<template>
  <n-message-provider>
    <n-space vertical :size="24" style="padding: 24px">
      <!-- Step 1: Select Tags and Genres -->
      <n-card>
        <template #header>
          <n-space align="center" justify="space-between">
            <n-h3 style="margin: 0">第一步：选择推荐标签</n-h3>
            <n-select
              v-model:value="displayMode"
              :options="displayModeOptions"
              style="width: 150px"
            />
          </n-space>
        </template>
        <n-space align="center">
          <n-button @click="fetchWordCloudTags" type="primary" ghost :loading="loading.tags"
            >获取高频标签</n-button
          >
          <n-button @click="fetchWordCloudGenres" type="success" ghost :loading="loading.genres"
            >获取高频流派</n-button
          >
          <n-button
            @click="clearSelections"
            type="error"
            ghost
            :disabled="selectedWords.length === 0"
            >清空选择</n-button
          >
        </n-space>

        <!-- Current Selections Summary -->
        <div v-if="selectedWords.length > 0" style="margin-top: 20px">
          <n-h4>当前选择</n-h4>
          <n-space style="margin-top: 10px">
            <n-tag
              v-for="word in selectedWords"
              :key="`selected-${word.id}`"
              :type="word.type === 'genre' ? 'success' : 'primary'"
              closable
              @close="removeWordSelection(word)"
              round
            >
              {{ word.name }}
            </n-tag>
          </n-space>
        </div>

        <n-divider />

        <!-- View Mode: Tags -->
        <div v-if="displayMode === 'tags'">
          <n-h4>标签 (Tags)</n-h4>
          <n-empty
            v-if="wordCloudTags.length === 0"
            description="请先获取高频标签"
            style="margin-top: 20px"
          ></n-empty>
          <n-space v-else>
            <n-tag
              v-for="word in wordCloudTags"
              :key="word.id"
              :type="isSelectedWord(word) ? 'primary' : 'default'"
              :bordered="!isSelectedWord(word)"
              @click="toggleWordSelection(word)"
              class="custom-tag"
              round
            >
              {{ word.name }} ({{ word.count }})
            </n-tag>
          </n-space>

          <n-h4 style="margin-top: 20px">流派 (Genres)</n-h4>
          <n-empty
            v-if="wordCloudGenres.length === 0"
            description="请先获取高频流派"
            style="margin-top: 20px"
          ></n-empty>
          <n-space v-else>
            <n-tag
              v-for="word in wordCloudGenres"
              :key="word.id"
              :type="isSelectedWord(word) ? 'success' : 'default'"
              :bordered="!isSelectedWord(word)"
              @click="toggleWordSelection(word)"
              class="custom-tag"
              round
            >
              {{ word.name }} ({{ word.count }})
            </n-tag>
          </n-space>
        </div>

        <!-- View Mode: Chart -->
        <div v-if="displayMode === 'chart'">
          <n-empty
            v-if="wordCloudTags.length === 0 && wordCloudGenres.length === 0"
            description="请先获取标签或流派数据"
            style="margin-top: 20px; height: 400px"
          ></n-empty>
          <div v-else style="display: flex; flex-direction: column; align-items: center">
            <!-- Tag Word Cloud -->
            <div style="width: 100%; position: relative">
              <n-h4 style="text-align: center; margin: 8px 0">标签 (Tags)</n-h4>
              <div
                v-if="wordCloudTags.length > 0"
                ref="tagCloudChartRef"
                style="width: 100%; height: 380px"
              ></div>
              <n-empty
                v-else
                description="暂无标签数据"
                style="
                  height: 380px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              ></n-empty>
            </div>

            <!-- Genre Word Cloud -->
            <div style="width: 100%; position: relative; margin-top: 20px">
              <n-h4 style="text-align: center; margin: 8px 0">流派 (Genres)</n-h4>
              <div
                v-if="wordCloudGenres.length > 0"
                ref="genreCloudChartRef"
                style="width: 100%; height: 380px"
              ></div>
              <n-empty
                v-else
                description="暂无流派数据"
                style="
                  height: 380px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                "
              ></n-empty>
            </div>
          </div>
        </div>
      </n-card>

      <!-- Step 2: Get Recommended Songs -->
      <n-card>
        <template #header>
          <n-h3 style="margin: 0">第二步：获取推荐歌曲</n-h3>
        </template>
        <n-button
          @click="fetchRecommendedSongs"
          :disabled="selectedWords.length === 0"
          type="primary"
          :loading="loading.recs"
        >
          获取推荐
        </n-button>
        <n-empty
          v-if="recommendedSongs.length === 0"
          description="暂无推荐歌曲"
          style="margin-top: 20px"
        ></n-empty>
        <n-list v-else style="margin-top: 20px" bordered>
          <n-checkbox-group v-model:value="selectedSongIds">
            <n-list-item v-for="song in recommendedSongs" :key="song.id">
              <n-space align="center">
                <n-checkbox :value="song.id" />
                <n-thing :title="song.name">
                  <template #description>
                    <n-text depth="3">Score: {{ song.score }}</n-text>
                  </template>
                </n-thing>
              </n-space>
            </n-list-item>
          </n-checkbox-group>
        </n-list>
      </n-card>

      <!-- Step 3: Get Song Details -->
      <n-card>
        <template #header>
          <n-h3 style="margin: 0">第三步：获取歌曲信息</n-h3>
        </template>
        <n-button
          @click="fetchSongDetails"
          :disabled="recommendedSongs.length === 0 || selectedSongIds.length === 0"
          type="primary"
          :loading="loading.details"
        >
          获取歌曲详情
        </n-button>
        <n-data-table
          :columns="columns"
          :data="finalSongList"
          :pagination="{ pageSize: 10 }"
          style="margin-top: 20px"
        />
      </n-card>
    </n-space>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  NMessageProvider,
  NSpace,
  NCard,
  NButton,
  NTag,
  NCheckboxGroup,
  NCheckbox,
  NDataTable,
  NH3,
  NH4,
  NDivider,
  NList,
  NListItem,
  NEmpty,
  NSelect,
  NThing,
  NText,
  useMessage,
} from 'naive-ui'
import * as echarts from 'echarts/core'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_view_recommend_page_info } from '@/views/view_app/music_page/page_recommend/store/store_view_recommend_page_info'

echarts.use([TooltipComponent, VisualMapComponent, CanvasRenderer])

const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
const message = useMessage()

// --- Reactive State ---
const loading = reactive({ tags: false, genres: false, recs: false, details: false })
const selectedWords = ref<any[]>([])
const selectedSongIds = ref<string[]>([])
const displayMode = ref('chart') // 默认视图改为词云图
const displayModeOptions = [
  { label: '标签视图', value: 'tags' },
  { label: '词云图视图', value: 'chart' },
]

// --- ECharts State ---
const tagCloudChartRef = ref<HTMLElement | null>(null)
const genreCloudChartRef = ref<HTMLElement | null>(null)
let tagChartInstance: echarts.ECharts | null = null
let genreChartInstance: echarts.ECharts | null = null

// --- Computed Properties ---
const wordCloudTags = computed(() => store_view_recommend_page_info.recommend_WordCloudTag_metadata)
const wordCloudGenres = computed(
  () => store_view_recommend_page_info.recommend_WordCloudGenre_metadata
)
const recommendedSongs = computed(
  () => store_view_recommend_page_info.recommend_MediaSearch_metadata
)
const finalSongList = computed(() => store_view_recommend_page_info.recommend_MediaFiles_temporary)

// --- Data Table Columns ---
const columns = [
  { title: '标题', key: 'title', resizable: true },
  { title: '歌手', key: 'artist', resizable: true },
  { title: '专辑', key: 'album', resizable: true },
  { title: '时长', key: 'duration_txt', resizable: true },
]

// --- Methods ---
const isSelectedWord = (word: any) => selectedWords.value.some((sw) => sw.id === word.id)

const clearSelections = () => {
  selectedWords.value = []
  if (displayMode.value === 'chart') {
    syncChartSelectionState()
  }
  message.info('已清空所有选择')
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
}

const removeWordSelection = (word: any) => {
  const index = selectedWords.value.findIndex((w) => w.id === word.id)
  if (index > -1) {
    selectedWords.value.splice(index, 1)
    if (displayMode.value === 'chart') {
      syncChartSelectionState()
    }
  }
}

const toggleWordSelection = (word: any) => {
  const index = selectedWords.value.findIndex((w) => w.id === word.id)
  if (index > -1) {
    selectedWords.value.splice(index, 1)
  } else {
    selectedWords.value.push(word)
  }
  if (displayMode.value === 'chart') {
    syncChartSelectionState()
  }
}

// --- API Fetching Methods ---
const fetchWordCloudTags = async () => {
  loading.tags = true
  try {
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_word_cloud()
    message.success('高频标签获取成功')
  } catch (e) {
    message.error('获取高频标签失败')
  } finally {
    loading.tags = false
  }
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
}

const fetchWordCloudGenres = async () => {
  loading.genres = true
  try {
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_word_cloud_genre()
    message.success('高频流派获取成功')
  } catch (e) {
    message.error('获取高频流派失败')
  } finally {
    loading.genres = false
  }
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
}

const fetchRecommendedSongs = async () => {
  if (selectedWords.value.length === 0) {
    message.warning('请至少选择一个标签或流派!')
    return
  }
  loading.recs = true
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  selectedSongIds.value = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []
  try {
    const keywords = selectedWords.value.map((w) => w.name).join(',')
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_result(keywords)
    message.success('推荐歌曲获取成功')
  } catch (e) {
    message.error('获取推荐歌曲失败')
  } finally {
    loading.recs = false
  }
}

const fetchSongDetails = async () => {
  if (selectedSongIds.value.length === 0) {
    message.warning('请至少选择一首推荐歌曲!')
    return
  }
  loading.details = true
  try {
    const ids = selectedSongIds.value.join(',')
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_medias(ids)
    message.success('歌曲详情获取成功')
  } catch (e) {
    message.error('获取歌曲详情失败')
  } finally {
    loading.details = false
  }
}

// --- ECharts Logic ---
let resizeObserver: ResizeObserver | null = null

const resizeCharts = () => {
  if (tagChartInstance) {
    tagChartInstance.resize()
  }
  if (genreChartInstance) {
    genreChartInstance.resize()
  }
}

onMounted(() => {
  const chartContainer = document.querySelector('.n-card')
  if (chartContainer) {
    resizeObserver = new ResizeObserver(resizeCharts)
    resizeObserver.observe(chartContainer)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', resizeCharts)
})
;('')
const initOrUpdateChart = (type: 'tag' | 'genre') => {
  const containerRef = type === 'tag' ? tagCloudChartRef.value : genreCloudChartRef.value
  const words = type === 'tag' ? wordCloudTags.value : wordCloudGenres.value
  const colorFunc = type === 'tag' ? getTagColor : getGenreColor

  if (!containerRef) return

  const chartInstance =
    type === 'tag'
      ? (tagChartInstance = echarts.getInstanceByDom(containerRef) || echarts.init(containerRef))
      : (genreChartInstance = echarts.getInstanceByDom(containerRef) || echarts.init(containerRef))

  if (words.length === 0) {
    chartInstance.clear()
    return
  }

  const counts = words.map((w) => w.count).filter((c) => c > 0)
  const maxCount = counts.length > 0 ? Math.max(...counts) : 100

  const chartData = words.map((word) => ({
    name: word.name,
    value: Number(word.count) || 0,
    originalData: { ...word, type },
    itemStyle: {
      color: colorFunc(word.name),
    },
  }))

  const vibrantColors = [
    '#FF6B6B',
    '#FFD166',
    '#06D6A0',
    '#118AB2',
    '#073B4C',
    '#EF476F',
    '#FFD166',
    '#06D6A0',
    '#118AB2',
    '#073B4C',
    '#9C89B8',
    '#F0A6CA',
    '#B8E0D2',
    '#95B8D1',
    '#EAC435',
  ]

  const option = {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        const data = params.data
        return `
          <div style="font-weight:bold">${data.name}</div>
          <div>出现次数: ${data.value}</div>
          <div>类型: ${type === 'tag' ? '标签' : '流派'}</div>
        `
      },
    },
    visualMap: {
      show: true, // 只在标签词云显示视觉映射
      min: 1,
      max: maxCount,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: {
        color: vibrantColors,
      },
      calculable: true,
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 80],
        rotationRange: [-45, 45],
        gridSize: 8,
        drawOutOfBound: false,
        data: chartData,
        selectedMode: 'multiple',
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function (params: any) {
            const hue = Math.floor(params.data.value % 360)
            return `hsl(${hue}, 70%, 60%)`
          },
        },
        emphasis: {
          scale: 1.2,
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
            borderColor: '#FFD700',
            borderWidth: 2,
          },
        },
        select: {
          itemStyle: {
            color: '#FFD700',
            shadowBlur: 15,
            shadowColor: 'rgba(255,215,0,0.8)',
          },
        },
      },
    ],
  }

  chartInstance.setOption(option, true)
  syncChartSelectionState()

  chartInstance.off('click')
  chartInstance.on('click', (params: any) => {
    toggleWordSelection(params.data.originalData)
  })
}

const syncChartSelectionState = () => {
  if (tagChartInstance && tagCloudChartRef.value) {
    const tagIndices = wordCloudTags.value
      .map((_, index) =>
        isSelectedWord({ ...wordCloudTags.value[index], type: 'tag' }) ? index : -1
      )
      .filter((index) => index !== -1)

    tagChartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0 })
    if (tagIndices.length > 0) {
      tagChartInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: tagIndices })
    }
  }

  if (genreChartInstance && genreCloudChartRef.value) {
    const genreIndices = wordCloudGenres.value
      .map((_, index) =>
        isSelectedWord({ ...wordCloudGenres.value[index], type: 'genre' }) ? index : -1
      )
      .filter((index) => index !== -1)

    genreChartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0 })
    if (genreIndices.length > 0) {
      genreChartInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: genreIndices })
    }
  }
}

// 为标签生成特定颜色
const getTagColor = (tag: string) => {
  const tagColors: Record<string, string> = {
    摇滚: '#FF6B6B',
    流行: '#FFD166',
    电子: '#06D6A0',
    古典: '#118AB2',
    爵士: '#073B4C',
    民谣: '#EF476F',
    嘻哈: '#9C89B8',
    金属: '#F0A6CA',
    蓝调: '#B8E0D2',
  }
  return tagColors[tag] || `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
}

// 为流派生成特定颜色
const getGenreColor = (genre: string) => {
  const genreColors: Record<string, string> = {
    电子舞曲: '#FF6B6B',
    独立摇滚: '#FFD166',
    氛围音乐: '#06D6A0',
    交响乐: '#118AB2',
    放克: '#073B4C',
    雷鬼: '#EF476F',
    乡村: '#9C89B8',
    'R&B': '#F0A6CA',
    世界音乐: '#B8E0D2',
  }
  return genreColors[genre] || `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
}

// --- Watchers ---
watch(displayMode, (newMode) => {
  if (newMode === 'chart') {
    nextTick(() => {
      initOrUpdateChart('tag')
      initOrUpdateChart('genre')
      syncChartSelectionState()
    })
  }
})

watch(
  [wordCloudTags, wordCloudGenres],
  () => {
    if (displayMode.value === 'chart') {
      nextTick(() => {
        initOrUpdateChart('tag')
        initOrUpdateChart('genre')
        syncChartSelectionState()
      })
    }
  },
  { deep: true }
)

// Initialize charts on mount when in chart mode
nextTick(() => {
  if (displayMode.value === 'chart') {
    initOrUpdateChart('tag')
    initOrUpdateChart('genre')
  }
})
</script>

<style scoped>
.n-card {
  border-radius: 8px;
}
.n-h3,
.n-h4 {
  margin: 0;
}
.custom-tag {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.custom-tag:hover {
  transform: translateY(-2px);
}
</style>
