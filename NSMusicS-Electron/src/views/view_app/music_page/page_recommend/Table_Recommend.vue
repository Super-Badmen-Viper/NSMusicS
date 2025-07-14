<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import {
  NMessageProvider,
  NSpace,
  NCard,
  NButton,
  NTag,
  NDataTable,
  NH3,
  NH4,
  NDivider,
  NEmpty,
  NSelect,
  useMessage,
} from 'naive-ui'
import * as echarts from 'echarts/core'
import { TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_view_recommend_page_info } from '@/views/view_app/music_page/page_recommend/store/store_view_recommend_page_info'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import {
  store_playlist_list_logic
} from '@/views/view_app/music_components/player_list/store/store_playlist_list_logic'

echarts.use([TooltipComponent, VisualMapComponent, CanvasRenderer])

const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
const message = useMessage()

// --- Reactive State ---
const loading = reactive({ tags: false, genres: false, recs: false, details: false })
const selectedWords = ref<any[]>([])
const displayMode = ref('chart')
const displayModeOptions = [
  { label: '词云图视图', value: 'chart' },
  { label: '标签视图', value: 'tags' },
]
let recommendationDebounceTimer: any = null

// --- ECharts State ---
const wordCloudChartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// --- Computed Properties ---
const wordCloudTags = computed(() => store_view_recommend_page_info.recommend_WordCloudTag_metadata)
const wordCloudGenres = computed(
  () => store_view_recommend_page_info.recommend_WordCloudGenre_metadata
)
const finalSongList = computed(() => store_view_recommend_page_info.recommend_MediaFiles_temporary)

const combinedWordCloudData = computed(() => {
  const tags = wordCloudTags.value.map(tag => ({ ...tag, type: 'tag' }))
  const genres = wordCloudGenres.value.map(genre => ({ ...genre, type: 'genre' }))
  return [...tags, ...genres].sort((a, b) => b.count - a.count)
})

// --- Data Table Columns ---
const columns = [
  { title: '标题', key: 'title', resizable: true },
  { title: '歌手', key: 'artist', resizable: true },
  { title: '专辑', key: 'album', resizable: true },
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
  } catch (e) {
    message.error('获取高频标签失败')
  } finally {
    loading.tags = false
  }
}

const fetchWordCloudGenres = async () => {
  loading.genres = true
  try {
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_word_cloud_genre()
  } catch (e) {
    message.error('获取高频流派失败')
  } finally {
    loading.genres = false
  }
}

const fetchRecommendationsAndDetails = async () => {
  if (selectedWords.value.length === 0) {
    store_view_recommend_page_info.recommend_MediaFiles_temporary = []
    return
  }

  loading.recs = true
  loading.details = true
  store_view_recommend_page_info.recommend_MediaSearch_metadata = []
  store_view_recommend_page_info.recommend_MediaFiles_temporary = []

  try {
    const keywords = selectedWords.value.map((w) => w.name).join(',')
    await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_result(keywords)

    const recommendedSongs = store_view_recommend_page_info.recommend_MediaSearch_metadata
    if (recommendedSongs.length > 0) {
      const ids = recommendedSongs.map((s: any) => s.id).join(',')
      await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_medias(ids)
      message.success(`成功获取 ${finalSongList.value.length} 首推荐歌曲`)
    } else {
      message.info('没有找到匹配的歌曲')
    }
  } catch (e) {
    message.error('获取推荐歌曲失败')
  } finally {
    loading.recs = false
    loading.details = false
  }
}

// --- ECharts Logic ---
let resizeObserver: ResizeObserver | null = null

const resizeCharts = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(async () => {
  // 1. 先加载数据
  await Promise.all([fetchWordCloudTags(), fetchWordCloudGenres()])

  // 2. 延迟初始化图表（等待DOM更新）
  setTimeout(() => {
    if (displayMode.value === 'chart') {
      initOrUpdateChart()
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', resizeCharts)
})

const initOrUpdateChart = () => {
  if (!wordCloudChartRef.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  const container = wordCloudChartRef.value
  container.style.visibility = 'visible'
  chartInstance = echarts.init(container)

  const words = combinedWordCloudData.value

  if (words.length === 0) {
    chartInstance.clear()
    return
  }

  const counts = words.map((w) => w.count).filter((c) => c > 0)
  const maxCount = counts.length > 0 ? Math.max(...counts) : 100

  const chartData = words.map((word) => ({
    name: word.name,
    value: Number(word.count) || 0,
    originalData: word,
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
        const type = data.originalData.type
        return `
          <div style="font-weight:bold">${data.name}</div>
          <div>出现次数: ${data.value}</div>
          <div>类型: ${type === 'tag' ? '标签' : '流派'}</div>
        `
      },
    },
    visualMap: {
      show: true,
      min: 1,
      max: maxCount,
      orient: 'vertical',
      left: 0,
      top: 'center',
      inRange: {
        color: vibrantColors,
      },
      calculable: true,
    },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [12, 30],
        rotationRange: [-45, 45],
        gridSize: 3,
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

  setTimeout(() => {
    if (chartInstance && !chartInstance.isDisposed()) {
      chartInstance.resize()
    }
  }, 50)
}

const syncChartSelectionState = () => {
  if (chartInstance && wordCloudChartRef.value) {
    const selectedIndices = combinedWordCloudData.value
      .map((word, index) => (isSelectedWord(word) ? index : -1))
      .filter((index) => index !== -1)

    chartInstance.dispatchAction({ type: 'unselect', seriesIndex: 0 })
    if (selectedIndices.length > 0) {
      chartInstance.dispatchAction({ type: 'select', seriesIndex: 0, dataIndex: selectedIndices })
    }
  }
}

// --- Watchers ---
watch(displayMode, (newMode) => {
  if (newMode === 'chart') {
    nextTick(() => {
      initOrUpdateChart()
      syncChartSelectionState()
    })
  }
})

watch(
  combinedWordCloudData,
  () => {
    if (displayMode.value === 'chart') {
      nextTick(() => {
        initOrUpdateChart()
        syncChartSelectionState()
      })
    }
  },
  { deep: true }
)

watch(selectedWords, () => {
  clearTimeout(recommendationDebounceTimer)
  recommendationDebounceTimer = setTimeout(() => {
    fetchRecommendationsAndDetails()
  }, 500) // 500ms debounce
}, { deep: true })

////// changed_data write to sqlite
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
const errorHandled = ref(new Map())
const handleImageError = async (item: any) => {
  let result_src = error_album
  if (errorHandled.value.has(item.id)) {
    item.medium_image_url = result_src
    return
  }
  errorHandled.value.set(item.id, true)
  ///
  if (isElectron) {
    const originalSrc = item.medium_image_url
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      if (newImagePath.length > 0) {
        item.medium_image_url = newImagePath
      } else {
        item.medium_image_url = result_src
      }
    } catch (error) {
      console.error('Error handling image error:', error)
      item.medium_image_url = result_src
    }
  } else {
    item.medium_image_url = error_album
  }
}
</script>

<template>
  <n-message-provider>
    <div class="recommend-container">
      <!-- Left Panel: Tag Selection -->
      <div class="left-panel">
        <n-card class="selection-card" :bordered="false">
          <template #header>
            <n-space align="center" justify="space-between">
              <n-h3 style="margin: 0">选择推荐标签</n-h3>
              <n-space align="center" justify="end">
                <n-button
                  @click="clearSelections"
                  type="error"
                  ghost
                  :disabled="selectedWords.length === 0">
                  清空选择
                </n-button>
                <n-select
                  v-model:value="displayMode"
                  :options="displayModeOptions"
                  style="width: 150px"
                />
              </n-space>
            </n-space>
          </template>

          <!-- Current Selections Summary -->
          <div v-if="selectedWords.length > 0" style="margin-bottom: 10px;">
            <n-h4>当前选择</n-h4>
            <n-space style="margin-top: -10px;">
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

          <!-- View Mode: Tags -->
          <div v-if="displayMode === 'tags'" class="tag-view-container">
            <n-h4 style="margin-bottom: 10px;">标签 (Tags)</n-h4>
            <n-empty
              v-if="wordCloudTags.length === 0"
              description="正在加载高频标签..."
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

            <n-h4 style="margin-top: 20px;margin-bottom: 10px;">流派 (Genres)</n-h4>
            <n-empty
              v-if="wordCloudGenres.length === 0"
              description="正在加载高频流派..."
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
          <div v-if="displayMode === 'chart'" class="chart-view-container">
            <n-empty
              v-if="wordCloudTags.length === 0 && wordCloudGenres.length === 0"
              description="正在加载标签和流派数据..."
            ></n-empty>
            <div v-else class="word-cloud-wrapper">
              <div ref="wordCloudChartRef" style="width: 50vw; height: 60vh;"></div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- Right Panel: Recommended Songs -->
      <div class="right-panel">
        <n-card class="results-card" :bordered="false">
          <template #header>
            <n-h3 style="margin: 0">推荐歌曲</n-h3>
          </template>
          <n-data-table
            v-if="false"
            :columns="columns"
            :data="finalSongList"
            :loading="loading.recs || loading.details"
          />
          <DynamicScroller
            class="table"
            :items="store_view_recommend_page_info.recommend_MediaFiles_temporary"
            key-field="play_id"
            :minItemSize="50"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :data-index="index"
                :data-active="active"
                class="message"
                @dblclick="()=>{
                  store_playlist_list_logic.handleItemDbClick(item, index);
                  store_playlist_list_info.playlist_MediaFiles_temporary = store_view_recommend_page_info.recommend_MediaFiles_temporary;
                }"
              >
                <!--            v-hammer:doubletap="() => handleDoubleTap(item, index)"-->
                <div
                  style="width: 499px; height: 70px;"
                  class="media_info">
                  <div
                    style="width: 58px; height: 58px;border-radius: 4px; border: 1.5px solid #ffffff20; overflow: hidden"
                  >
                    <img
                      :key="item.absoluteIndex"
                      :src="item.medium_image_url"
                      @error="handleImageError(item)"
                      style="width: 100%; height: 100%; object-fit: cover"
                    />
                  </div>
                  <div
                    style="width: 240px;font-size: 15px;"
                    class="title_playlist"
                  >
                  <span style="font-size: 16px;font-weight: 600;">
                    {{ item.title }}
                  </span>
                  <br />
                  <template v-for="artist in item.artist.split(/[\/|｜、]/)">
                    <span>
                      {{ artist + '&nbsp' }}
                    </span>
                  </template>
                  </div>
                  <span
                    class="index"
                    style="text-align: left; font-size: 15px"
                  >
                    {{ index + 1 }}
                  </span>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </n-card>
      </div>
    </div>
  </n-message-provider>
</template>

<style scoped>
.recommend-container {
  display: flex;
  margin-left: 10px;
  margin-top: 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
}

.left-panel {
  width: 55%;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.right-panel {
  width: 45%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.selection-card,
.results-card {
  border-radius: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-view-container {
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.word-cloud-wrapper {
  flex: 1;
  min-height: 300px;
  position: relative;
}

.n-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table {
  height: calc(100vh - 212px);
}
.message {
  display: flex;
  align-items: left;
}
.media_info {
  display: flex;
  align-items: center;
  border-radius: 4px;

  transition: background-color 0.3s;
}
.media_info:hover {
  background-color: #ffffff24;
}
.index {
  width: 50px;
  margin-left: 12px;
}
.title_playlist {
  margin-left: 10px;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title_playlist :hover {
  text-decoration: underline;
  cursor: pointer;
  color: #3dc3ff;
}
.duration_txt {
  margin-left: 20px;
  text-align: left;
  width: 50px;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
}
</style>
