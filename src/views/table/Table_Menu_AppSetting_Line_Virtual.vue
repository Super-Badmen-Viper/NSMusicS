<script setup lang="ts">
  ////// this_view resource of vicons_svg
  import {
    BareMetalServer,Add,Close
  } from '@vicons/carbon'
  import { useI18n } from 'vue-i18n'
  const { t, d, n } = useI18n({
    inheritLocale: true
  })

  ////// this_view components of navie ui 
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
  import { NButton } from 'naive-ui'

  ////// passed as argument
  const emits = defineEmits([
    'update_lang'
  ]);
  const props = defineProps<{
    app_left_menu_collapsed: Boolean;
    window_innerWidth: number;
  }>();

  ////// 服务器配置添加
  const Type_Server_Kinds = [
    {
      value: "NSMusicS",
      label: "NSMusicS"
    },
    {
      value: "JellyFin",
      label: "JellyFin"
    },
    {
      value: 'Navidrome',
      label: 'Navidrome'
    },
  ].map((s) => {
    s.value = s.value.toLowerCase()
    return s
  })
  const Type_Server_Selected = ref(Type_Server_Kinds[2].value)
  const Type_Server_Add = ref(false)
  /// 服务器管理
  type Type_Server_Info = {
    id: string
    tags: string[]
    show: boolean
    type: string
    name: string
    url: string
    username: string
    password: string
  }
  const createData = (): Type_Server_Info[] => {
    const baseData = {
      tags: ['nice', 'developer'],
      show: false,
      type: 'Navidrome',
      name: 'mozhi',
      url: 'yxbb',
      username: 'xiang',
      password: 'xiang',
    };
    return Array.from({ length: 25 }, (_, index) => ({
      ...baseData,
      id: ('0000' + (index + 1)).slice(-4), // 确保id是四位数，不足前面补0
    }));
  };
  const data_temporary_Server_Info = ref(createData());

  ////// 设置：通用
  const languages = [
    {
      label: '简体中文',
      value: 'zhHans',
    },
    {
      label: '繁體中文',
      value: 'zhHant',
    },
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Čeština',
      value: 'cs',
    },
    {
      label: 'Español',
      value: 'es',
    },
    {
      label: 'Deutsch',
      value: 'de',
    },
    {
      label: 'Français',
      value: 'fr',
    },
    {
      label: 'Italiano',
      value: 'it',
    },
    {
      label: '日本語',
      value: 'ja',
    },
    {
      label: 'Nederlands',
      value: 'nl',
    },
    {
      label: 'Português (Brasil)',
      value: 'ptBr',
    },
    {
      label: 'Polski',
      value: 'pl',
    },
    {
      label: 'Русский',
      value: 'ru',
    },
    {
      label: 'Srpski',
      value: 'sr',
    },
    {
      label: 'Svenska',
      value: 'sv',
    },
  ];
  const player_lyric_panel_fontfamily_options_selected = ref<{label:any,value:any}>();
  const player_lyric_panel_fontfamily_options = ref([
    {
      label: 'Drive My Car',
      value: 'song1'
    },
    {
      label: 'Norwegian Wood',
      value: 'song2'
    },
    {
      label: "You Won't See",
      value: 'song3'
    },
    {
      label: 'Nowhere Man',
      value: 'song4'
    },
    {
      label: 'Think For Yourseld',
      value: 'song5'
    },
    {
      label: 'The Word',
      value: 'song6'
    },
    {
      label: 'Michelle',
      value: 'song7'
    },
    {
      label: 'What goes on',
      value: 'song8'
    },
    {
      label: 'Girl',
      value: 'song9'
    },
    {
      label: "I'm looking through you",
      value: 'song10'
    },
    {
      label: 'In My Life',
      value: 'song11'
    },
    {
      label: 'Wait',
      value: 'song12'
    }])

  ////// lineItems Re render
  let bool_watch = false;
  const timer = ref<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    timer.value = setInterval(() => {
      bool_watch = true;
    }, 1000);
  };
  const stopWatching_collapsed_width = watch(() => props.app_left_menu_collapsed, (newValue, oldValue) => {
    updateGridItems();
  });
  const stopWatching_window_innerWidth = watch(() => props.window_innerWidth, (newValue, oldValue) => {
    bool_watch = false;
    updateGridItems();
    if (bool_watch) {
      startTimer();
    }
  });
  const collapsed_width = ref<number>(1090);
  const updateGridItems = () => {
    if (props.app_left_menu_collapsed == true) {
      collapsed_width.value = 145;
    } else {
      collapsed_width.value = 240;
    }
  };
  onMounted(() => {
    startTimer();
    updateGridItems();
  });

  ////// view songlist_view Remove data
  onBeforeUnmount(() => {
    stopWatching_collapsed_width()
    stopWatching_window_innerWidth()
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  });
</script>
<template>
  <div class="view">
    <n-layout
      embedded
      content-style="margin-left: 9px;"
      vertical
      :size="12" >
      <n-card
        class="table"
        style="overflow: hidden;border-radius: 6px;"
        :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
        <n-tabs
          style="margin-top: -20px;"
          default-value="tab_pane_1"
          size="large"
          animated
          pane-wrapper-style="margin: 0 -4px"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
          <!-- 服务器 -->
          <n-tab-pane name="tab_pane_1">
            <template #tab>
              {{ $t('page.appMenu.manageServers') }}
            </template>
            <n-space style="height: calc(100vh - 230px);" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 160) + 'px)'}">
              <!-- 服务器管理 -->
              <n-space vertical size="large">
                <n-space justify="space-between">
                  <span style="font-size: 20px;font-weight: 600;">{{ $t('page.appMenu.manageServers') }}</span>
                  <n-button tertiary  @click="Type_Server_Add = !Type_Server_Add" style="margin-right: 35px;">
                    <template #icon>
                      <n-icon>
                        <Add />
                      </n-icon>
                    </template>
                    {{ $t('form.addServer.title') }}
                  </n-button>
                </n-space>
                <DynamicScroller
                  class="table" ref="scrollbar"
                  style="overflow: auto;width: 785px;max-height: 62vh;"
                  :items="data_temporary_Server_Info"
                  :itemSize="70"
                  :grid-items="3"
                  :item-secondary-size="260">
                  <!-- :minItemSize="6"> -->
                  <template #default="{ item, index, active }">
                    <DynamicScrollerItem
                      :item="item"
                      :active="active"
                      :data-index="index"
                      :data-active="active"
                      style="display: flex;"
                      >
                      <div
                        class="server_item_info"
                        @click="item.show = !item.show"
                        style="
                          width: 230px;
                          height: 54px;
                          margin-bottom: 14px;
                          border: 1px solid #f0f0f070;border-radius: 5px;
                          padding-top: 14px;padding-left: 14px;padding-right: 14px;
                          box-shadow: #18181820 0 0 0 1px inset;
                        ">
                        <n-space justify="space-between" style="margin-top: 2.5px;">
                          <n-space>
                            <n-icon size="20">
                              <BareMetalServer />
                            </n-icon>
                            <span>{{ item.type+' - '+item.name }}</span>
                          </n-space>
                          <span>{{ (index+1) }}</span>
                        </n-space>
                        <n-modal
                          v-model:show="item.show">
                          <n-card style="width: 450px;border-radius: 6px;">
                            <n-space
                              vertical size="large" style="width: 400px;">
                              <n-space justify="space-between" style="margin-bottom: 12px;">
                                <span style="font-size: 20px;font-weight: 600;">{{ $t('page.appMenu.manageServers') }}</span>
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
                                  <span>{{ $t('form.addServer.input_name') }}</span>
                                  <n-input clearable size="small" :default-value="item.name" placeholder=""/>
                                </n-space>
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_url') }}</span>
                                  <n-input-group>
                                    <n-input-group-label size="small">http://</n-input-group-label>
                                    <n-input clearable size="small" :default-value="item.url" placeholder=""/>
                                  </n-input-group>
                                </n-space>
                                <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_username') }}</span>
                                  <n-input clearable size="small" :default-value="item.username" placeholder=""/>
                                </n-space>
                                  <n-space vertical size="small" style="margin-bottom: 10px;">
                                  <span>{{ $t('form.addServer.input_password') }}</span>
                                  <n-input clearable type="password" show-password-on="click" size="small" :default-value="item.password" placeholder=""/>
                                </n-space>
                              </n-form>
                              <n-space justify="end">
                                <n-button  size="small" strong secondary type="error">
                                  {{ $t('common.delete') }}
                                </n-button>
                                <n-button size="small" strong secondary type="info">
                                  {{ $t('common.save') }}
                                </n-button>
                              </n-space>
                            </n-space>
                          </n-card>
                        </n-modal>
                      </div>
                    </DynamicScrollerItem>
                  </template>
                </DynamicScroller>
              </n-space>
              <!-- 服务器添加 -->
              <n-modal
                v-model:show="Type_Server_Add">
                <n-card style="width: 450px;border-radius: 6px;">
                  <n-space
                    vertical size="large" style="width: 400px;">
                    <n-space justify="space-between">
                      <span style="font-size: 20px;font-weight: 600;">{{ $t('form.addServer.title') }}</span>
                      <n-button tertiary size="small" @click="Type_Server_Add = !Type_Server_Add">
                        <template #icon>
                          <n-icon>
                            <Close />
                          </n-icon>
                        </template>
                      </n-button>
                    </n-space>
                    <n-radio-group v-model:value="Type_Server_Selected">
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          disabled
                          :key="Type_Server_Kinds[0].value"
                          :value="Type_Server_Kinds[0].value"
                          :label="Type_Server_Kinds[0].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 132px;"
                          disabled
                          :key="Type_Server_Kinds[1].value"
                          :value="Type_Server_Kinds[1].value"
                          :label="Type_Server_Kinds[1].label"
                      />
                      <n-radio-button
                          style="text-align: center;width: 133px;"
                          :key="Type_Server_Kinds[2].value"
                          :value="Type_Server_Kinds[2].value"
                          :label="Type_Server_Kinds[2].label"
                      />
                    </n-radio-group>
                    <n-form inline>
                      <n-space vertical style="width: 150px;margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_name') }}</span>
                        <n-input clearable placeholder=""/>
                      </n-space>
                      <n-space vertical style="width: 250px;margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_url') }}</span>
                        <n-input-group>
                          <n-input-group-label>http://</n-input-group-label>
                          <n-input clearable placeholder=""/>
                        </n-input-group>
                      </n-space>
                    </n-form>
                    <n-form style="margin-top: -12px;">
                      <n-space vertical style="margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_username') }}</span>
                        <n-input clearable placeholder=""/>
                      </n-space>
                      <n-space vertical style="margin-bottom: 10px;">
                        <span>{{ $t('form.addServer.input_password') }}</span>
                        <n-input clearable type="password" show-password-on="click" placeholder=""/>
                      </n-space>
                    </n-form>
                    <n-space justify="end">
                      <n-button strong secondary type="error">
                        {{ $t('common.delete') }}
                      </n-button>
                      <n-button strong secondary type="info">
                        {{ $t('common.save') }}
                      </n-button>
                    </n-space>
                  </n-space>
                </n-card>
              </n-modal>
            </n-space>
          </n-tab-pane>
          <!-- 通用 -->
          <n-tab-pane name="tab_pane_2">
            <template #tab>
              {{ $t('page.setting.generalTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <!-- 通用-语言-字体 -->
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">语言</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">设置此应用的语言</span>
                    </div>
                  </n-space>
<!--                  {{ $t('action.editPlaylist', { arg: 'kazupon' }) }}-->
                  <n-select
                    v-model:value="$i18n.locale"
                    :options="languages"
                    style="width: 207px;margin-top: -4px;"
                    @update:value="emits('update_lang',$i18n.locale)"
                  />
                </n-space>
                <n-divider style="margin: 0;"/>
                <!-- 通用-主题 -->
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">跟随系统</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">使用系统定义的浅色或深色主题</span>
                    </div>
                  </n-space>
                  <n-switch
                    v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">主题</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">设置此应用的主题</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="微软雅黑"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">保存播放列表</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">当应用程序关闭时保存播放队列，并在应用程序打开时恢复它</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space vertical :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space justify="space-between" align="center">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">主页配置</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">当应用程序关闭时保存播放队列，并在应用程序打开时恢复它</span>
                      </div>
                    </n-space>
                  </n-space>
                  <n-checkbox-group>
                    <n-grid :y-gap="8" :cols="4">
                      <n-gi>
                        <n-checkbox value="Pushes Open" label="最多播放" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="The Window" label="从库中搜索" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="And Raises" label="最近添加的发布" />
                      </n-gi>
                      <n-gi>
                        <n-checkbox value="The Spyglass" label="最近播放" />
                      </n-gi>
                    </n-grid>
                  </n-checkbox-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space vertical :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space justify="space-between" align="center">
                    <n-space vertical>
                      <span style="font-size:16px;font-weight: 600;">侧边栏设定</span>
                      <div style="margin-top: -10px;">
                        <span style="font-size:12px;">在折叠的侧边栏中显示或隐藏导航</span>
                      </div>
                    </n-space>
                  </n-space>
                  <n-checkbox-group>
                    <n-grid :y-gap="8" :cols="4">
                      <n-gi><n-checkbox value="Pushes Open" label="正在播放" /></n-gi>
                      <n-gi><n-checkbox value="The Window" label="搜索" /></n-gi>
                      <n-gi><n-checkbox value="And Raises" label="主页" /></n-gi>
                      <n-gi><n-checkbox value="The Spyglass" label="专辑" /></n-gi>
                      <n-gi><n-checkbox value="Pushes Open" label="歌曲" /></n-gi>
                      <n-gi><n-checkbox value="The Window" label="歌手" /></n-gi>
                      <n-gi><n-checkbox value="And Raises" label="流派" /></n-gi>
                      <n-gi><n-checkbox value="The Spyglass" label="播放列表" /></n-gi>
                      <n-gi><n-checkbox value="The Window" label="设置" /></n-gi>
                    </n-grid>
                  </n-checkbox-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">清除NSMusicS缓存</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">feishin的“软清除”。这将会刷新播放列表、元数据并重置保存的歌词。会保留设置、服务器凭据和缓存图像</span>
                    </div>
                  </n-space>
                  <n-button>
                    清空
                  </n-button>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">清除浏览器缓存</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">feishin的“硬清除”。除了清除feishin的缓存，清空浏览器缓存（保存的图像和其他资源）。会保留服务器凭据和设置"</span>
                    </div>
                  </n-space>
                  <n-button>
                    清空
                  </n-button>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <!-- 播放 -->
          <n-tab-pane name="tab_pane_3">
            <template #tab>
              {{ $t('page.setting.playbackTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <!-- 通用-语言-字体 -->
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">音频设备</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">选择用于播放的音频设备（仅 web 播放器）</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="微软雅黑"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">选择播放器的播放风格</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">选择播放器的播放风格</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="微软雅黑"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">淡入淡出持续时间</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">选择用于音频播放器的淡入淡出风格</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable default-value="100"/>
                    <n-input-group-label>ms</n-input-group-label>
                  </n-input-group>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">采样率</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">如果选择的采样频率与当前媒体的采样频率不同，请选择要使用的输出采样率。小于 8000 的值将使用默认频率</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable default-value="48000"/>
                    <n-input-group-label>Hz</n-input-group-label>
                  </n-input-group>
                </n-space>
                <n-divider style="margin: 0;"/>
                <!-- 通用-主题 -->
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">歌词偏移</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">将歌词偏移指定的毫秒数</span>
                    </div>
                  </n-space>
                  <n-input-group style="width: 207px;margin-top: -4px;">
                    <n-input clearable default-value="100"/>
                    <n-input-group-label>ms</n-input-group-label>
                  </n-input-group>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <!-- 快捷键 -->
          <n-tab-pane name="tab_pane_4">
            <template #tab>
              {{ $t('page.setting.hotkeysTab') }}
            </template>
          </n-tab-pane>
          <!-- 窗口 -->
          <n-tab-pane name="tab_pane_5">
            <template #tab>
              {{ $t('page.setting.windowTab') }}
            </template>
            <n-scrollbar style="max-height: 70vh;" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 203) + 'px)'}">
              <n-space vertical>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">窗口顶栏风格</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">选择窗口顶栏风格</span>
                    </div>
                  </n-space>
                  <n-select
                      v-model:value="player_lyric_panel_fontfamily_options_selected"
                      :options="player_lyric_panel_fontfamily_options"
                      placeholder="微软雅黑"
                      :reset-menu-on-options-change="false"
                      style="width: 207px;margin-top: -4px;"
                  />
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">最小化到托盘</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">将应用程序最小化到系统托盘</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">退出时最小化到托盘</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">退出应用时最小化到系统托盘而非关闭</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">启动最小化</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">在系统托盘中启动应用程序</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
                <n-divider style="margin: 0;"/>
                <n-space justify="space-between" align="center" :style="{ width: 'calc(100vw - ' + (collapsed_width - 9 + 230) + 'px)'}">
                  <n-space vertical>
                    <span style="font-size:16px;font-weight: 600;">禁用自动更新</span>
                    <div style="margin-top: -10px;">
                      <span style="font-size:12px;">禁用自动更新</span>
                    </div>
                  </n-space>
                  <n-switch
                      v-model:value="disabled">
                  </n-switch>
                </n-space>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>


        </n-tabs>
      </n-card>
    </n-layout>
  </div>
</template>
<style scoped>
.view{
  height: calc(100vh - 160px);
  overflow: auto;
  overflow-x:hidden;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 160px);
  overflow: auto;
}

.server_item_info {
  transition: outline-color 0.3s ease, background-color 0.3s ease;
}
.server_item_info:hover {
  outline: 0.5px solid #f0f0f090;
  background-color: #f0f0f090;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>