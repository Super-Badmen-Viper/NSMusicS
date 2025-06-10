<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  AddCircle32Regular,
  ArrowReset24Filled,
  Folder24Regular,
} from '@vicons/fluent'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {Close} from "@vicons/carbon";
import {NButton, NIcon} from "naive-ui";

import {ref, computed, watch, onMounted, onBeforeUnmount} from "vue";

import {
  Folder_Entity_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Folder_Entity/index_service";
import {useI18n} from "vue-i18n";
const { t } = useI18n({
  inheritLocale: true
})

import { useMessage, MessageReactive } from 'naive-ui'
const message = useMessage()

const Type_Server_Add = ref(false)
const server_set_of_addLibrary_of_name = ref('')
const server_set_of_addLibrary_of_path = ref('')
/// server add
async function update_server_addUser() {
  try {
    const result = await folder_Entity_ApiService_of_NineSong.createFolder_Entity(
        server_set_of_addLibrary_of_name.value,
        server_set_of_addLibrary_of_path.value,
        1
    );
    if (result) {
      message.success(t('form.addServer.success'));
      await scan_server_folder_path([server_set_of_addLibrary_of_path.value], 1, 0);
    } else {
      message.error(t('error.invalidServer'), { duration: 3000 });
    }
  } catch (e) {
    message.error(t('error.invalidServer'), { duration: 3000 });
  } finally {
    Type_Server_Add.value = !Type_Server_Add.value;
  }
}
/// server delete
async function update_server_deleteUser(id: string) {
  try {
    const result = await folder_Entity_ApiService_of_NineSong.deleteFolder_Entity(
        id
    )
    if (result) {
      message.success(t('form.updateServer.success'))
    } else {
      message.error(t('error.invalidServer'), {duration: 3000})
    }
  }catch{
    message.error(t('error.invalidServer'),{ duration: 3000 })
  }
}
/// server update
async function update_server_setUser(id: string, newName: string, newFolderPath: string) {
  try {
    const result = await folder_Entity_ApiService_of_NineSong.updateFolder_Entity(
        id,
        newName, newFolderPath,
    )
    if(result){
      message.success(t('form.updateServer.success'))
    }else{
      message.error(t('error.invalidServer'),{ duration: 3000 })
    }
  }catch{
    message.error(t('error.invalidServer'),{ duration: 3000 })
  }
}
/// server folder find
let lastPath = '';
let lastProcessedPath = ''; // 新增：记录上一次处理的路径
async function find_server_folder_path(path: string) {
  // 1. 检查是否为重复操作（当前路径与上一次处理路径相同）
  const isRepeatOperation = path === lastProcessedPath;
  server_set_of_addLibrary_of_path.value = path;

  // 2. 保存当前路径到临时变量（用于后续比较）
  const currentPathBeforeProcessing = lastPath;
  const result = await folder_Entity_ApiService_of_NineSong.browseFolder_Entity(path);
  if (result) {
    // 3. 映射文件夹选项
    browseFolderOptions.value = result.map((item: any) => ({
      label: item.name,
      value: item.path,
    }));

    browseFolderOptions.value.unshift({
      label: '...',
      value: lastPath
    });

    // 5. 更新路径记录（仅在非重复操作时更新）
    if (!isRepeatOperation) {
      // 保存当前操作前的路径作为下次的返回路径
      lastPath = currentPathBeforeProcessing;
      // 记录本次处理的路径
      lastProcessedPath = path;
    }
  }
}
///
const stopWatching_Type_Server_Add = watch(() => Type_Server_Add.value, async (newValue) => {
  if (newValue) {
    await find_server_folder_path('')
  }
});
/// server scan
async function scan_server_folder_path(folder_paths: string[], folder_type: number, scan_model: number){
  createMessage()
}
let messageReactive: MessageReactive | null = null
const createMessage = () => {
  if (!messageReactive) {
    messageReactive = message.info(t('LabelCurrentStatus') + ': ' + t('ScanLibrary'), {
      closable: true,
      duration: 5000
    })
  }
}
const removeMessage = () => {
  if (messageReactive) {
    messageReactive.destroy()
    messageReactive = null
  }
}

// gridItems Re render
////// librarylist_view page_layout gridItems
const item_library = ref<number>(160)
const item_library_image = ref<number>(item_library.value - 20)
const item_library_txt = ref<number>(item_library.value - 20)
const itemSize = ref(180);
const gridItems = ref(5);
const itemSecondarySize = ref(185);
const collapsed_width = ref<number>(1090);
const stopWatching_window_innerWidth = watch(() => store_app_configs_info.window_innerWidth, () => {
  updateGridItems();
});
const updateGridItems = () => {
  collapsed_width.value = 145;
  if(window.innerWidth > 2160){
    const num = window.innerWidth / 7.53
    itemSize.value = Math.floor(num) - 100;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 4;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }else if(window.innerWidth > 1360){
    const num = window.innerWidth / 6.53
    itemSize.value = Math.floor(num) - 100;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 3;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }else{
    const num = window.innerWidth / 5.53
    itemSize.value = Math.floor(num) - 100;
    item_library.value = Math.floor(num);
    item_library_image.value = item_library.value - 20;
    item_library_txt.value = item_library.value - 20;
    gridItems.value = 2;
    itemSecondarySize.value = Math.floor(window.innerWidth - (collapsed_width.value + 320)) / gridItems.value - 2;
  }
};
let folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(store_server_login_info.server_url)
onMounted(async () => {
  updateGridItems();
  if(store_server_users.server_select_kind === 'ninesong') {
    store_server_users.server_all_library = await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
    console.log(store_server_users.server_all_library)
  }
});
onBeforeUnmount(() => {
  stopWatching_window_innerWidth()
  stopWatching_Type_Server_Add()
});

import error_album_old from '@/assets/img/error_album_old.jpg'
import {
  store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import {
  store_player_view
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_view";
import {
  store_player_appearance
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_appearance";
import {
  store_player_audio_info
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";

const contentTypeValue = ref(1)
const contentTypeOptions = ref([
  {
    label: computed(() => t('TabMusic')),
    value: 1,
    disabled: true
  },
  {
    label: computed(() => t('HeaderVideos')),
    value: 2,
    disabled: true
  },
  {
    label: computed(() => t('HeaderPhotoAlbums')),
    value: 3,
    disabled: true
  },
  {
    label: computed(() => t('Movies')),
    value: 4,
    disabled: true
  },
  {
    label: computed(() => t('TV')),
    value: 5,
    disabled: true
  },
  {
    label: computed(() => t('Books')),
    value: 6,
    disabled: true
  },
])

const browseFolderOptions = ref([])

const refreshModeValue = ref(0)
const refreshModeOptions = ref([
  {
    label: computed(() => t('ScanForNewAndUpdatedFiles')),
    value: 0,
  },
  {
    label: computed(() => t('SearchForMissingMetadata')),
    value: 1,
  },
  {
    label: computed(() => t('ReplaceAllMetadata')),
    value: 2,
  },
])

</script>
<template>
  <n-space vertical>
    <div style="font-weight: 600;font-size: 16px;margin-bottom: 4px;">
      {{ $t('HeaderLibraries') }} >
    </div>
    <n-space vertical>
      <n-space justify="start">
        <n-button icon-placement="left"
                  secondary strong
                  @click="Type_Server_Add = !Type_Server_Add"
        >
          <template #icon>
            <NIcon>
              <AddCircle32Regular />
            </NIcon>
          </template>
          {{ $t('ButtonAddMediaLibrary') }}
        </n-button>
        <n-button icon-placement="left"
                  secondary strong
                  @click="async () => {
                    await scan_server_folder_path([],1,2,)
                    removeMessage()
                  }"
        >
          <template #icon>
            <NIcon>
              <ArrowReset24Filled />
            </NIcon>
          </template>
          {{ $t('ButtonScanAllLibraries') }}
        </n-button>
      </n-space>
      <DynamicScroller
         class="table" ref="scrollbar"
         :style="{
            width: 'calc(100vw - ' + (collapsed_width + 320) + 'px)',
         }"
         style="overflow: auto;margin-top: 6px;"
         :items="store_server_users.server_all_library"
         :itemSize="itemSize"
         :grid-items="gridItems"
         :item-secondary-size="326">
        <!-- :minItemSize="6"> -->
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            style="display: flex;"
          >
            <n-alert
              class="server_item_info"
              tag="div"
              @click="() => {
                item.show = !item.show;
              }"
              style="
                width: 308px;
                border-radius: 6px;
                padding: 0;
                box-shadow: #18181820 0 0 0 1px inset;
              ">
              <template #icon>
                <n-icon>
                  <Folder24Regular />
                </n-icon>
              </template>
              <n-space vertical justify="end">
                <div>
                  <n-space>
                    <div style="width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                      {{ item.name }}
                    </div>
                  </n-space>
                  <n-space>
                    <div style="width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                      <span v-if="item.folderType && item.folderType === 1">
                        {{ $t('TabMusic') }}
                      </span>
                      <span v-if="item.folderType && item.folderType === 2">
                        {{ $t('HeaderVideos') }}
                      </span>
                      <span v-if="item.folderType && item.folderType === 3">
                        {{ $t('HeaderPhotoAlbums') }}
                      </span>
                      <span v-if="item.folderType && item.folderType === 4">
                        {{ $t('Books') }}
                      </span>
                    </div>
                  </n-space>
                  <n-space>
                    <div style="width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                      {{ item.folderPath }}
                    </div>
                  </n-space>
                </div>
              </n-space>
              <n-modal
                  v-model:show="item.show">
                <n-card style="width: 450px;border-radius: 4px;">
                  <n-space
                      vertical size="large" style="width: 400px;">
                    <n-space justify="space-between" style="margin-bottom: 12px;">
                      <span style="font-size: 20px;font-weight: 600;">{{ $t('ManageLibrary') }}</span>
                      <n-button tertiary size="small" @click="item.show = false">
                        <template #icon>
                          <n-icon>
                            <Close />
                          </n-icon>
                        </template>
                      </n-button>
                    </n-space>
                    <n-form style="margin-top: -12px;">
                      <n-space vertical size="small" style="margin-bottom: 10px;">
                        <span>{{ $t('ButtonRename') }}</span>
                        <n-input clearable size="small" v-model:value="item.name" placeholder=""/>
                      </n-space>
                      <n-space vertical size="small" style="margin-bottom: 10px;">
                        <span>{{ $t('Folders') + $t('HeaderPaths') }}</span>
                        <n-input clearable size="small" v-model:value="item.folderPath" placeholder=""/>
                      </n-space>
                      <n-space vertical size="small" style="margin-bottom: 10px;">
                        <span>{{ $t('LabelRefreshMode')}}</span>
                        <n-select v-model:value="refreshModeValue" :options="refreshModeOptions" />
                      </n-space>
                    </n-form>
                    <n-space justify="space-between">
                      <n-button strong secondary type="info"
                                @click="async () => {
                                  item.show = false;
                                  await scan_server_folder_path([item.folderPath], 1, refreshModeValue);
                                  removeMessage()
                                }">
                        {{ $t('ScanLibrary') }}
                      </n-button>
                      <n-space justify="end">
                        <n-button strong secondary type="error"
                                  @click="item.show = false;update_server_deleteUser(item.id);">
                          {{ $t('common.delete') }}
                        </n-button>
                        <n-button
                            strong secondary type="info"
                            @click="()=>{
                            update_server_setUser(
                                item.id,
                                item.name,
                                item.folderPath,
                            )
                          }">
                          {{ $t('common.save') }}
                        </n-button>
                      </n-space>
                    </n-space>
                  </n-space>
                </n-card>
              </n-modal>
            </n-alert>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>
    <!-- 服务器添加 -->
    <n-modal
        v-model:show="Type_Server_Add">
      <n-card style="width: 450px;border-radius: 4px;">
        <n-space
            vertical size="large" style="width: 400px;">
          <n-space justify="space-between">
            <span style="font-size: 20px;font-weight: 600;">{{ $t('ButtonAddMediaLibrary') }}</span>
            <n-button tertiary size="small" @click="Type_Server_Add = !Type_Server_Add">
              <template #icon>
                <n-icon>
                  <Close />
                </n-icon>
              </template>
            </n-button>
          </n-space>
          <n-form>
            <n-space vertical style="margin-bottom: 10px;">
              <span>{{ $t('LabelContentType') }}</span>
              <n-select v-model:value="contentTypeValue" :options="contentTypeOptions" />
            </n-space>
            <n-space vertical style="margin-bottom: 10px;">
              <span>{{ $t('LabelDisplayName') }}</span>
              <n-input-group>
                <n-input clearable placeholder="any" v-model:value="server_set_of_addLibrary_of_name"/>
              </n-input-group>
            </n-space>
            <n-space vertical style="margin-bottom: 10px;">
              <span>{{ $t('Folders') }}</span>
              <n-input clearable placeholder="any" v-model:value="server_set_of_addLibrary_of_path"/>
              <n-select v-model:value="server_set_of_addLibrary_of_path"
                        :options="browseFolderOptions"
                        placement="bottom"
                        @click="find_server_folder_path(server_set_of_addLibrary_of_path)"
                        @update:value="(value: string) => find_server_folder_path(value)"
              />
              <n-list
                clickable
                :show-divider="false"
                style="
                  height: 160px;
                  overflow: auto;
                ">
                <template #default>
                  <n-list-item
                    style="height: 40px;"
                    :style="{
                      textAlign: store_player_appearance.player_collapsed_album ? 'center' : 'left'
                    }"
                    v-for="(item, index) in browseFolderOptions"
                    @click="find_server_folder_path(item.value)">
                    <div class="library_info" style="height: 40px;">
                      {{ item.label }}
                    </div>
                  </n-list-item>
                </template>
              </n-list>
            </n-space>
          </n-form>
          <n-space justify="end">
            <n-button strong secondary type="error" @click="Type_Server_Add = !Type_Server_Add">
              {{ $t('common.delete') }}
            </n-button>
            <n-button strong secondary type="info" @click="update_server_addUser();">
              {{ $t('common.save') }}
            </n-button>
          </n-space>
        </n-space>
      </n-card>
    </n-modal>
  </n-space>
</template>
<style scoped>
.library_info{
  font-size: 14px;
}
.library_info:hover {
  background-color: #f0f0f090;
}
</style>