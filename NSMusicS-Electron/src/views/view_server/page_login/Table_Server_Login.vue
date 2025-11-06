<script setup lang="ts">
//////
import { useI18n } from 'vue-i18n'
import error_album_old from '@/assets/img/error_album_old.jpg'
import NSMusicS from '@/assets/img/NSMusicS.png'
import { darkTheme, NConfigProvider, useMessage } from 'naive-ui'
import { store_server_login_info } from '@/data/data_status/comment_status/login_store/store_server_login_info'
import { store_server_login_logic } from '@/data/data_status/comment_status/login_store/store_server_login_logic'
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
