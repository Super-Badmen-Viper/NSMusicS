<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  NMessageProvider,
  NSpace,
  NCard,
  NButton,
  NH3,
  NSelect,
  useMessage,
  useThemeVars,
} from 'naive-ui'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'

const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
const message = useMessage()
const themeVars = useThemeVars()

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { Folder_Entity_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Folder_Entity/index_service'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_view_tag_page_info } from '@/views/view_app/page/page_tag/store/store_view_tag_page_info'
const { t } = useI18n({
  inheritLocale: true,
})

///
const browseFolderOptions = ref([])
const browseFolderPathOptions = ref([])
let folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(
  store_server_login_info.server_url
)
onMounted(async () => {
  if (store_server_users.server_select_kind === 'ninesong') {
    store_server_users.server_all_library =
      await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
    browseFolderOptions.value = store_server_users.server_all_library.map((item: any) => ({
      label: item.name,
      value: item.folderPath,
    }))
  }
  ///
  store_view_media_page_logic.page_songlists_library_path = ''
  store_view_media_page_logic.page_songlists_library_folder_path = ''
  ///
  store_view_tag_page_info.tag_metadata_find_model = true
  ///
  store_view_tag_page_info.tag_LibraryItems_metadata = []
  store_view_tag_page_info.tag_LibraryItems_temporary = []
  ///
})
onBeforeUnmount(() => {
  store_view_tag_page_info.tag_metadata_find_model = false
  store_view_media_page_logic.page_songlists_library_path = ''
  store_view_media_page_logic.page_songlists_library_folder_path = ''
  ///
  store_view_tag_page_info.tag_LibraryItems_metadata = []
  store_view_tag_page_info.tag_LibraryItems_temporary = []
  ///
})
async function filter_media_folder_path() {
  ///
  store_view_tag_page_info.tag_LibraryItems_metadata = []
  store_view_tag_page_info.tag_LibraryItems_temporary = []
  ///
  if (store_view_tag_page_info.tag_type_select === 'media') {
    await store_general_fetch_media_list.fetchData_Media()
  } else if (store_view_tag_page_info.tag_type_select === 'album') {
    await store_general_fetch_album_list.fetchData_Album()
  } else if (store_view_tag_page_info.tag_type_select === 'artist') {
    await store_general_fetch_artist_list.fetchData_Artist()
  } else if (store_view_tag_page_info.tag_type_select === 'media_cue') {
    await store_general_fetch_media_cue_list.fetchData_Media()
  }
}
async function find_server_folder_path(path: string) {
  if (path === undefined || path === '') {
    path = store_view_media_page_logic.page_songlists_library_path
  }
  const result = await folder_Entity_ApiService_of_NineSong.browseFolder_Entity(path)
  if (result) {
    browseFolderPathOptions.value = result.map((item: any) => ({
      label: item.name,
      value: item.path,
    }))
    browseFolderPathOptions.value.unshift({
      label: '...',
      value: store_view_media_page_logic.page_songlists_library_path,
    })
  }
}

import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'
const jsonValue = ref()
function find_json_value(id: string) {
  try {
    jsonValue.value = store_view_tag_page_info.tag_LibraryItems_metadata.find(
      (item) => item.ID === id
    )
  } catch {
    jsonValue.value = ''
  }
}

//////
const isScrolling = ref(false)
const onScrollEnd = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    if (store_view_tag_page_info.tag_type_select === 'media') {
      await store_general_fetch_media_list.fetchData_Media_of_server_web_end()
    } else if (store_view_tag_page_info.tag_type_select === 'album') {
      await store_general_fetch_album_list.fetchData_Album_of_server_web_end()
    } else if (store_view_tag_page_info.tag_type_select === 'artist') {
      await store_general_fetch_artist_list.fetchData_Artist_of_server_web_end()
    } else if (store_view_tag_page_info.tag_type_select === 'media_cue') {
      await store_general_fetch_media_cue_list.fetchData_Media_of_server_web_end()
    }
  }
  isScrolling.value = false
}

//////
const tag_type_options = ref([
  {
    label: computed(() => t('entity.track_other')),
    value: 'media',
  },
  {
    label: computed(() => t('entity.album_other')),
    value: 'album',
  },
  {
    label: computed(() => t('entity.artist_other')),
    value: 'artist',
  },
  {
    label: computed(() => 'CUE ' + t('nsmusics.view_page.disk')),
    value: 'media_cue',
  },
])
</script>

<template>
  <n-message-provider>
    <div style="position: absolute; top: 0">
      <n-space align="center">
        <div style="font-size: 20px; font-weight: 600; margin-left: 11px">
          {{ $t('Metadata') + $t('HeaderAdmin') + ': ' }}
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
        <n-space align="center">
          <n-select
            size="small"
            style="min-width: 136px"
            :disabled="
              !(
                store_server_user_model.model_server_type_of_web &&
                store_server_users.server_select_kind === 'ninesong'
              )
            "
            :options="tag_type_options"
            v-model:value="store_view_tag_page_info.tag_type_select"
            @update:value="filter_media_folder_path"
          />
          <div
            v-if="
              !(
                store_server_user_model.model_server_type_of_web &&
                store_server_users.server_select_kind === 'ninesong'
              )
            "
            style="font-size: 15px; font-weight: bold"
          >
            {{
              '-> ' +
              $t('Alternate') +
              $t('Data') +
              $t('LabelSource') +
              ', ' +
              $t('error.serverRequired') +
              ': NineSong'
            }}
            <br />
          </div>
        </n-space>
      </n-space>
    </div>

    <div class="tag-container">
      <!-- Left Panel: Tag Selection -->
      <div class="left-tag-panel">
        <n-card class="selection-tag-card" :bordered="false">
          <template #header>
            <n-space justify="start" v-if="store_view_tag_page_info.tag_type_select === 'media'">
              <n-space
                vertical
                v-if="
                  store_server_user_model.model_server_type_of_web &&
                  store_server_users.server_select_kind === 'ninesong'
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{ $t('HeaderLibraries') }}</span>
                <n-space vertical>
                  <n-select
                    v-model:value="store_view_media_page_logic.page_songlists_library_path"
                    :options="browseFolderOptions"
                    placement="bottom"
                    style="width: 170px"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        store_view_media_page_logic.page_songlists_library_path = ''
                        store_view_media_page_logic.page_songlists_library_folder_path = ''
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('Folders') + $t('Filters')
                }}</span>
                <n-space vertical>
                  <n-select
                    :disabled="store_view_media_page_logic.page_songlists_library_path.length === 0"
                    v-model:value="store_view_media_page_logic.page_songlists_library_folder_path"
                    :options="browseFolderPathOptions"
                    placement="bottom"
                    style="width: 170px"
                    @click="
                      find_server_folder_path(
                        store_view_media_page_logic.page_songlists_library_folder_path
                      )
                    "
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        store_view_media_page_logic.page_songlists_library_folder_path = ''
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
          </template>
          <DynamicScroller
            class="table_tag"
            :style="{
              marginTop: store_view_tag_page_info.tag_type_select === 'media' ? '0px' : '20px',
            }"
            :items="store_view_tag_page_info.tag_LibraryItems_temporary"
            key-field="absoluteIndex"
            :minItemSize="50"
            @scroll-end="onScrollEnd"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :item="item"
                :active="active"
                :data-index="index"
                :data-active="active"
                class="message_tag"
                @click="find_json_value(item.id)"
              >
                <!--            v-hammer:doubletap="() => handleDoubleTap(item, index)"-->
                <div class="tag_info">
                  <div class="tag_file_name">
                    <span style="font-size: 12px; font-weight: 600">
                      {{ item.file_name }}
                    </span>
                  </div>
                  <!-- Index -->
                  <span class="index">
                    {{ item.absoluteIndex }}
                  </span>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
          <template #footer> ... </template>
        </n-card>
      </div>

      <!-- Right Panel: Recommended Songs -->
      <div class="right-tag-panel">
        <n-card class="results-tag-card" :bordered="false">
          <template #header>
            <n-h3 style="margin: 0; font-weight: 600">
              {{
                $t('Browse') + $t('Metadata') + ' | ' + $t('EditMetadata') + $t('common.comingSoon')
              }}
            </n-h3>
          </template>
          <div style="height: 100%; overflow-y: auto">
            <json-viewer style="margin-left: -20px; margin-top: -20px" :value="jsonValue">
            </json-viewer>
          </div>
          <template #footer> ... </template>
        </n-card>
      </div>
    </div>
  </n-message-provider>
</template>

<style scoped>
.tag-container {
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

  display: flex;
  padding: 10px;
  gap: 1.5rem;
  height: calc(100vh - 174px);
  margin-top: 30px;
  box-sizing: border-box;
}

.left-tag-panel,
.right-tag-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex-shrink: 0;
  width: 42%;
}

.right-tag-panel {
  width: 60%;
}

.selection-tag-card,
.results-tag-card {
  background-color: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition:
    box-shadow 0.3s ease-in-out,
    border-color 0.3s ease-in-out;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.selection-tag-card:hover,
.results-tag-card:hover {
  border-color: var(--primary-color-hover);
  box-shadow: 0 0 7px 0 var(--primary-color-suppl);
}

.selection-tag-card :deep(.n-card__content),
.results-tag-card :deep(.n-card__content) {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: 0 1.5rem; /* Add padding back to content */
}

:deep(.n-card-header) {
  padding: 1rem 1.5rem;
}

.table_tag {
  width: 100%;
  height: 100%;
}

.message_tag {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}
.message_tag:nth-child(1) {
  margin-top: 10px;
}
.message_tag:hover {
  background-color: var(--hover-color);
}

.tag_info {
  width: calc(100% - 20px);
  height: 50px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out; /* Smooth transition for all properties */
  border-radius: 8px; /* iOS-style rounded corners */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05); /* Subtle initial shadow */
}

.tag_file_name {
  margin-left: 1rem;
  text-align: left;
  overflow: hidden;
  color: var(--text-color-1);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.tag_file_name span:first-child {
  font-weight: 600;
  font-size: 1rem;
}

.tag_file_name span:not(:first-child) {
  font-size: 0.875rem;
  color: var(--text-color-2);
}

.tag_file_name:hover {
  color: var(--primary-color-hover);
}

.index {
  width: calc(10%);
  margin-left: auto;
  color: var(--text-color-3);
  text-align: center;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-color-hover);
}
</style>
