<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
//////
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'

// 导入 storeToRefs
import { storeToRefs } from 'pinia'

import { useI18n } from 'vue-i18n'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
const { t } = useI18n({
  inheritLocale: true,
})

// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playerAudioStore = usePlayerAudioStore()
// 使用 storeToRefs 解构出所需的响应式属性
const {
  player_use_lottie_animation,
  player_use_background_filter_blur,
  player_use_playbar_auto_hide,
} = storeToRefs(playerAppearanceStore)

const {
  player_select,
  player_kind,
  player_device_select,
  player_device_kind,
  player_fade_value,
  player_mpvExtraParameters,
  player_audio_channel,
  player_samp_value,
  player_gaplessAudio,
  player_audioExclusiveMode,
  player_replayGainMode,
  player_replayGainPreamp,
  player_replayGainClip,
  player_replayGainFallback,
  player_dolby,
} = storeToRefs(playerAudioStore)

// store_router_data_logic 不是 Pinia store，所以直接使用
const { clear_Memory_Model, clear_Equilibrium_Model, clear_UserExperience_Model } =
  store_router_data_logic

/////// 设置：播放
const player_fade_model_options_selected = ref()
const player_fade_model_options = ref([
  {
    label: computed(() => t('setting.playbackStyle_optionNormal')),
    value: 'playbackStyle_optionNormal',
  },
  {
    label: computed(() => t('setting.playbackStyle_optionCrossFade')),
    value: 'playbackStyle_optionCrossFade',
  },
])
const update_player_fade_model_options_selected = () => {
  if (player_fade_model_options_selected.value === 'playbackStyle_optionNormal') {
    player_fade_value.value = 0
  } else if (player_fade_model_options_selected.value === 'playbackStyle_optionCrossFade') {
    player_fade_value.value = 2000
  }
}
const update_player_fade_value = () => {
  if (player_fade_value.value != 0) {
    player_fade_model_options_selected.value = 'playbackStyle_optionCrossFade'
  } else {
    player_fade_model_options_selected.value = 'playbackStyle_optionNormal'
  }
}
const update_player_dolby = () => {
  if (player_dolby.value) {
    player_select.value = 'web'
  }
}
const update_player_samp_value = (value: any) => {
  player_samp_value.value = value
}
const computed_i18n_Label_mpvExtraParameters = computed(
  () => t('setting.mpvExtraParameters_help') + ':\n--gapless-audio=weak\n--prefetch-playlist=yes'
)
const update_player_mpvExtraParameters = (value: any) => {
  player_mpvExtraParameters.value = value
}
const player_gaplessAudio_kind = ref([
  { label: computed(() => t('common.no')), value: 'no' },
  { label: computed(() => t('common.yes')), value: 'yes' },
  { label: computed(() => t('setting.gaplessAudio_optionWeak')), value: 'weak' },
])
const player_audio_channel_kind = ref([
  { label: 'empty', value: 'empty' },
  { label: 'mono', value: 'mono' },
  { label: '1.0', value: '1.0' },
  { label: 'stereo', value: 'stereo' },
  { label: '2.0', value: '2.0' },
  { label: '2.1', value: '2.1' },
  { label: '3.0', value: '3.0' },
  { label: '3.0(back)', value: '3.0(back)' },
  { label: '4.0', value: '4.0' },
  { label: 'quad', value: 'quad' },
  { label: 'quad(side)', value: 'quad(side)' },
  { label: '3.1', value: '3.1' },
  { label: '3.1(back)', value: '3.1(back)' },
  { label: '5.0', value: '5.0' },
  { label: '5.0(alsa)', value: '5.0(alsa)' },
  { label: '5.0(side)', value: '5.0(side)' },
  { label: '4.1', value: '4.1' },
  { label: '4.1(alsa)', value: '4.1(alsa)' },
  { label: '5.1', value: '5.1' },
  { label: '5.1(alsa)', value: '5.1(alsa)' },
  { label: '5.1(side)', value: '5.1(side)' },
  { label: '6.0', value: '6.0' },
  { label: '6.0(front)', value: '6.0(front)' },
  { label: 'hexagonal', value: 'hexagonal' },
  { label: '6.1', value: '6.1' },
  { label: '6.1(back)', value: '6.1(back)' },
  { label: '6.1(top)', value: '6.1(top)' },
  { label: '6.1(front)', value: '6.1(front)' },
  { label: '7.0', value: '7.0' },
  { label: '7.0(front)', value: '7.0(front)' },
  { label: '7.0(rear)', value: '7.0(rear)' },
  { label: '7.1', value: '7.1' },
  { label: '7.1(alsa)', value: '7.1(alsa)' },
  { label: '7.1(wide)', value: '7.1(wide)' },
  { label: '7.1(wide-side)', value: '7.1(wide-side)' },
  { label: '7.1(top)', value: '7.1(top)' },
  { label: '7.1(rear)', value: '7.1(rear)' },
  { label: 'octagonal', value: 'octagonal' },
  { label: 'cube', value: 'cube' },
  { label: 'hexadecagonal', value: 'hexadecagonal' },
  { label: 'downmix', value: 'downmix' },
  { label: '22.2', value: '22.2' },
  { label: 'auto', value: 'auto' },
])
const player_replayGainMode_kind = ref([
  { label: 'Track', value: 'track' },
  { label: 'Album', value: 'album' },
  { label: computed(() => t('common.none')), value: 'no' },
])
onMounted(() => {
  if (player_fade_value.value > 0) {
    player_fade_model_options_selected.value = player_fade_model_options.value[1].value
  } else {
    player_fade_model_options_selected.value = player_fade_model_options.value[0].value
  }
  //
  if (player_gaplessAudio.value === 'no') {
    player_gaplessAudio.value = player_gaplessAudio_kind.value[0].value
  } else if (player_gaplessAudio.value === 'yes') {
    player_gaplessAudio.value = player_gaplessAudio_kind.value[1].value
  } else {
    player_gaplessAudio.value = player_gaplessAudio_kind.value[2].value
  }
  //
  if (player_replayGainMode.value === 'track') {
    player_replayGainMode.value = player_replayGainMode_kind.value[0].value
  } else if (player_replayGainMode.value === 'album') {
    player_replayGainMode.value = player_replayGainMode_kind.value[1].value
  } else {
    player_replayGainMode.value = player_replayGainMode_kind.value[2].value
  }
})

//////
import { openLink } from '@/utils/electron/openLink'
</script>
<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo">
      <n-scrollbar style="max-height: 70vh">
        <n-space vertical>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{ $t('setting.audioPlayer') }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('setting.audioPlayer_description') +
                  ' | ' +
                  $t('nsmusics.view_page.audio_player_web_explain')
                }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_select"
              :options="player_kind"
              :disabled="
                store_system_configs_info.desktop_system_kind === 'linux' ||
                store_system_configs_info.desktop_system_kind === 'docker'
              "
              @update:value="
                () => {
                  clear_Memory_Model = false
                  clear_Equilibrium_Model = false
                  clear_UserExperience_Model = true
                }
              "
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{ $t('setting.audioDevice') }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.audioDevice_description') }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_device_select"
              :options="player_device_kind"
              :disabled="player_select === 'mpv'"
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.playbackStyle_description')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.playbackStyle_description') }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_fade_model_options_selected"
              :options="player_fade_model_options"
              @update:value="update_player_fade_model_options_selected"
              :disabled="store_player_audio_logic.player_select === 'mpv'"
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.crossfadeStyle')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.crossfadeStyle_description') }}</span>
              </div>
            </n-space>
            <n-input-group style="width: 207px; margin-top: -4px">
              <n-input
                clearable
                v-model:value="player_fade_value"
                @update:value="update_player_fade_value"
                :disabled="player_select === 'mpv'"
              />
              <n-input-group-label>ms</n-input-group-label>
            </n-input-group>
          </n-space>
          <n-divider style="margin: 0" />
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.audioPlayer') + ' | mpv'
              }}</span>
            </n-space>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.mpvExtraParameters')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.mpvExtraParameters') }}</span>
              </div>
              <div style="margin-top: -10px; margin-left: -3px">
                <a
                  style="font-size: 15px; cursor: pointer"
                  @click="openLink('https://mpv.io/manual/stable/#audio')"
                  >https://mpv.io/manual/stable/#audio</a
                >
              </div>
            </n-space>
            <n-input
              style="width: 207px; margin-top: -4px"
              :value="player_mpvExtraParameters"
              @update:value="update_player_mpvExtraParameters"
              type="textarea"
              :placeholder="computed_i18n_Label_mpvExtraParameters"
            />
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('nsmusics.view_page.audio_channel')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('nsmusics.view_page.audio_channel_explain')
                }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_audio_channel"
              :options="player_audio_channel_kind"
              :disabled="player_select != 'mpv'"
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space vertical style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{ $t('setting.sampleRate') }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.sampleRate_description') }}</span>
              </div>
            </n-space>
            <n-space justify="space-between" align="center">
              <div></div>
              <n-input-group style="width: 207px; margin-top: -4px">
                <n-input
                  clearable
                  :disabled="player_select != 'mpv'"
                  default-value="48000"
                  :value="player_samp_value"
                  @update:value="update_player_samp_value"
                />
                <n-input-group-label>Hz</n-input-group-label>
              </n-input-group>
            </n-space>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.gaplessAudio')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.gaplessAudio_description') }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_gaplessAudio"
              :options="player_gaplessAudio_kind"
              :disabled="player_select != 'mpv'"
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.audioExclusiveMode')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('setting.audioExclusiveMode_description')
                }}</span>
              </div>
            </n-space>
            <n-switch :disabled="player_select != 'mpv'" v-model:value="player_audioExclusiveMode">
            </n-switch>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.replayGainMode')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{ $t('setting.replayGainMode_description') }}</span>
              </div>
            </n-space>
            <n-select
              v-model:value="player_replayGainMode"
              :options="player_replayGainMode_kind"
              :disabled="player_select != 'mpv'"
              placeholder="not enabled"
              :reset-menu-on-options-change="false"
              style="width: 207px; margin-top: -4px"
            />
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.replayGainPreamp')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('setting.replayGainPreamp_description')
                }}</span>
              </div>
            </n-space>
            <n-input-group style="width: 207px; margin-top: -4px">
              <n-input
                clearable
                :disabled="store_player_audio_logic.player_select != 'mpv'"
                default-value="48000"
                v-model:value="player_replayGainPreamp"
              />
            </n-input-group>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.replayGainClipping')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('setting.replayGainClipping_description')
                }}</span>
              </div>
            </n-space>
            <n-switch
              :disabled="store_player_audio_logic.player_select != 'mpv'"
              v-model:value="player_replayGainClip"
            >
            </n-switch>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.replayGainFallback')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('setting.replayGainFallback_description')
                }}</span>
              </div>
            </n-space>
            <n-input-group style="width: 207px; margin-top: -4px">
              <n-input
                clearable
                :disabled="store_player_audio_logic.player_select != 'mpv'"
                default-value="48000"
                v-model:value="player_replayGainFallback"
              />
            </n-input-group>
          </n-space>
          <n-divider style="margin: 0" />
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('setting.audioPlayer') + ' | web'
              }}</span>
            </n-space>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-left: 30px">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('nsmusics.view_page.dolby_switching')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('nsmusics.view_page.dolby_switching_explain')
                }}</span>
              </div>
            </n-space>
            <n-switch
              :disabled="player_select != 'web'"
              v-model:value="player_dolby"
              @update:value="update_player_dolby"
            >
            </n-switch>
          </n-space>
          <n-divider style="margin: 0" />
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('nsmusics.view_player.view_seting.player_use_lottie')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('nsmusics.view_player.view_seting.player_use_lottie_explain')
                }}</span>
              </div>
            </n-space>
            <n-switch v-model:value="player_use_lottie_animation"> </n-switch>
          </n-space>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('nsmusics.view_player.view_seting.coverBaseVague')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('nsmusics.view_player.view_seting.coverBaseVague')
                }}</span>
              </div>
            </n-space>
            <n-switch v-model:value="player_use_background_filter_blur"> </n-switch>
          </n-space>
          <n-space justify="space-between" align="center">
            <n-space vertical>
              <span style="font-size: 16px; font-weight: 600">{{
                $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide')
              }}</span>
              <div style="margin-top: -10px">
                <span style="font-size: 12px">{{
                  $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide_explain')
                }}</span>
              </div>
            </n-space>
            <n-switch v-model:value="player_use_playbar_auto_hide"> </n-switch>
          </n-space>
        </n-space>
      </n-scrollbar>
    </div>
  </n-space>
</template>

<style scoped>
.dynamic-scroller-demo {
  overflow: auto;
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
