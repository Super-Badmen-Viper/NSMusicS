<script setup lang="ts">
//////
import { useI18n } from 'vue-i18n'
import error_album_old from '@/assets/img/error_album_old.jpg'
import NSMusicS from '@/assets/img/NSMusicS.png'
import { darkTheme, NConfigProvider, useMessage, NIcon } from 'naive-ui'
import { store_server_login_info } from '@/data/data_status/comment_status/login_store/store_server_login_info'
import { store_server_login_logic } from '@/data/data_status/comment_status/login_store/store_server_login_logic'
import {isElectron} from "@/utils/electron/isElectron";
const { t } = useI18n({
  inheritLocale: true,
})

const message = useMessage()
async function login() {
  const result = await store_server_login_logic.server_login(
    store_server_login_info.server_input_email,
    store_server_login_info.server_input_password
  )
  if (result === undefined) {
    message.error(t('error.invalidServer') + ': ' + t('HeaderConnectionFailure'))
  } else if (!result) {
    message.error(t('HeaderLoginFailure'))
  }
}

////// i18n auto lang
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { h, onMounted, computed, } from 'vue'
import { RouterLink} from 'vue-router'
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink(nameValue, defaultValue) {
  store_router_data_info.router_click = true
  return () => h(RouterLink, { to: { name: nameValue } }, { default: () => defaultValue })
}
function create_menuOptions_appBar() {
  store_system_configs_info.app_view_menuOptions = []
  store_system_configs_info.app_view_menuOptions.push(
    {
      label: computed(() => renderRouterLink('setting', t('HeaderAdmin') + t('Console'))),
      key: 'setting',
      icon: renderIcon(Settings20Regular),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } }
  )
  store_system_configs_info.app_view_menuOptions.push(
    {
      label: computed(() =>
        renderRouterLink('charts', t('Play') + t('nsmusics.siderbar_menu.charts'))
      ),
      key: 'charts',
      icon: renderIcon(DataHistogram20Regular),
    },
    {
      label: computed(() => renderRouterLink('recommend', t('nsmusics.view_page.recommend'))),
      key: 'recommend',
      icon: renderIcon(FindInPageFilled),
    },
    {
      label: computed(() => renderRouterLink('home', t('common.home'))),
      key: 'home',
      icon: renderIcon(Home28Regular),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } },
    {
      label: computed(() =>
        renderRouterLink(
          'recently_added',
          t('filter.recentlyAdded') + ' | ' + t('MediaInfoTimestamp')
        )
      ),
      key: 'recently_added',
      icon: renderIcon(History20Filled),
    },
    {
      label: computed(() => renderRouterLink('album', t('entity.album_other'))),
      key: 'album',
      icon: renderIcon(AlbumFilled),
    },
    {
      label: computed(() => renderRouterLink('media', t('entity.track_other'))),
      key: 'media',
      icon: renderIcon(MusicNoteRound),
    },
    {
      label: computed(() => renderRouterLink('artist', t('entity.artist_other'))),
      key: 'artist',
      icon: renderIcon(UserAvatarFilledAlt),
    },
    {
      label: computed(() => renderRouterLink('media_cue', 'CUE ' + t('nsmusics.view_page.disk'))),
      key: 'media_cue',
      icon: renderIcon(LibraryMusicOutlined),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } },
    {
      label: computed(() => renderRouterLink('tag', t('Metadata') + t('HeaderAdmin'))),
      key: 'tag',
      icon: renderIcon(TagMultiple24Regular),
    }
  )
  /// 兼容性代码，在更新多模态模式之后，将删除方法部分代码
  store_system_configs_info.menuOptions_selectd_model_1 = false
  store_system_configs_info.menuOptions_selectd_model_2 = false
  store_system_configs_info.menuOptions_selectd_model_3 = false
  store_system_configs_info.menuOptions_selectd_model_4 = false
}
onMounted(() => {
  create_menuOptions_appBar()
})
</script>
<template>
  <div class="view">
    <n-config-provider :theme="darkTheme">
      <n-layout
        embedded
        vertical
        :style="{
          background: `url(${error_album_old}) no-repeat center center / cover`,
        }"
      >
        <n-space style="width: 100vw; height: 100vh" justify="center">
          <n-card
            style="
              top: 30vh;
              border: 2px solid #ffffff20;
              border-radius: 10px;
              background-color: #18181c75;
              width: 300px;
            "
          >
            <n-space justify="center" style="margin-top: -60px; margin-bottom: 10px">
              <img
                :src="NSMusicS"
                style="width: 70px; height: 70px; border: 2px solid #18181c80; border-radius: 12px"
                alt=""
              />
              <div style="width: 250px; text-align: center; font-size: 22px; font-weight: 600">
                NSMusicS 九歌音乐
              </div>
            </n-space>
            <n-form>
              <n-space vertical style="margin-bottom: 10px">
                <span style="font-size: 15px; font-weight: 600">{{
                  $t('nsmusics.server_page.server_email')
                }}</span>
                <n-input
                  clearable
                  placeholder="any"
                  v-model:value="store_server_login_info.server_input_email"
                  style="border: 1.5px solid #ffffff20"
                />
              </n-space>
              <n-space vertical style="margin-bottom: 10px">
                <span style="font-size: 15px; font-weight: 600">{{ $t('LabelPassword') }}</span>
                <n-input
                  clearable
                  type="password"
                  show-password-on="click"
                  placeholder="any"
                  v-model:value="store_server_login_info.server_input_password"
                  style="border: 1.5px solid #ffffff20"
                />
              </n-space>
            </n-form>
            <n-button style="width: 250px; margin-top: 10px" @click="login" type="success">
              {{ $t('ButtonSignIn') }}
            </n-button>
          </n-card>
        </n-space>
      </n-layout>
    </n-config-provider>
  </div>
</template>
<style scoped>
.view {
  height: calc(100vh);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
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
