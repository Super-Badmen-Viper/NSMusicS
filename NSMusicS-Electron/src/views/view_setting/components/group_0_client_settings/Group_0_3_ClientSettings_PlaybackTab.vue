<script setup lang="ts">
////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

////// this_view views_components
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { ref, onMounted, computed } from 'vue'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { store_player_appearance } from '@/views/view_app/music_page/page_player/store/store_player_appearance'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
const theme_value = ref('lightTheme')
const theme_options = ref([
  {
    label: computed(() => t('setting.themeLight')),
    value: 'lightTheme',
  },
  {
    label: computed(() => t('setting.themeDark')),
    value: 'darkTheme',
  },
])
onMounted(() => {
  if (store_app_configs_info.update_theme) theme_value.value = theme_options.value[1].value
  else theme_value.value = theme_options.value[0].value
})

/////// 设置：播放
const player_fade_model_options_selected = ref<{ label: any; value: any }>()
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
    store_player_audio_logic.player_fade_value = 0
  } else if (player_fade_model_options_selected.value === 'playbackStyle_optionCrossFade') {
    store_player_audio_logic.player_fade_value = 2000
  }
}
const update_player_fade_value = () => {
  if (store_player_audio_logic.player_fade_value != 0) {
    player_fade_model_options_selected.value = 'playbackStyle_optionCrossFade'
  } else {
    player_fade_model_options_selected.value = 'playbackStyle_optionNormal'
  }
}
const update_player_dolby = () => {
  if (store_player_audio_logic.player_dolby) {
    store_player_audio_logic.player_select = 'web'
  }
}
const update_player_samp_value = (value: any) => {
  store_player_audio_logic.player_samp_value = value
}
const computed_i18n_Label_mpvExtraParameters = computed(
  () => t('setting.mpvExtraParameters_help') + ':\n--gapless-audio=weak\n--prefetch-playlist=yes'
)
const update_player_mpvExtraParameters = (value: any) => {
  store_player_audio_logic.player_mpvExtraParameters = value
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
  if (store_player_audio_logic.player_fade_value > 0) {
    player_fade_model_options_selected.value = player_fade_model_options.value[1].value
  } else {
    player_fade_model_options_selected.value = player_fade_model_options.value[0].value
  }
  //
  if (store_player_audio_logic.player_gaplessAudio === 'no') {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[0].value
  } else if (store_player_audio_logic.player_gaplessAudio === 'yes') {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[1].value
  } else {
    store_player_audio_logic.player_gaplessAudio = player_gaplessAudio_kind.value[2].value
  }
  //
  if (store_player_audio_logic.player_replayGainMode === 'track') {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[0].value
  } else if (store_player_audio_logic.player_replayGainMode === 'album') {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[1].value
  } else {
    store_player_audio_logic.player_replayGainMode = player_replayGainMode_kind.value[2].value
  }
})

//////
import { openLink } from '@/utils/electron/openLink'
</script>

<template>
  <n-scrollbar style="overflow-y: auto; margin-top: 9px">
    <n-space vertical>
      <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">
        {{ $t('page.setting.playbackTab') }} >
      </div>
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
          v-model:value="store_player_audio_logic.player_select"
          :options="store_player_audio_logic.player_kind"
          :disabled="
            store_app_configs_info.desktop_system_kind === 'linux' ||
            store_app_configs_info.desktop_system_kind === 'docker'
          "
          @update:value="
            () => {
              store_router_data_logic.clear_Memory_Model = false
              store_router_data_logic.clear_Equilibrium_Model = false
              store_router_data_logic.clear_UserExperience_Model = true
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
          v-model:value="store_player_audio_logic.player_device_select"
          :options="store_player_audio_logic.player_device_kind"
          :disabled="store_player_audio_logic.player_select === 'mpv'"
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
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.crossfadeStyle') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.crossfadeStyle_description') }}</span>
          </div>
        </n-space>
        <n-input-group style="width: 207px; margin-top: -4px">
          <n-input
            clearable
            v-model:value="store_player_audio_logic.player_fade_value"
            @update:value="update_player_fade_value"
            :disabled="store_player_audio_logic.player_select === 'mpv'"
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
          :value="store_player_audio_logic.player_mpvExtraParameters"
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
          v-model:value="store_player_audio_logic.player_audio_channel"
          :options="player_audio_channel_kind"
          :disabled="store_player_audio_logic.player_select != 'mpv'"
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
              :disabled="store_player_audio_logic.player_select != 'mpv'"
              default-value="48000"
              :value="store_player_audio_logic.player_samp_value"
              @update:value="update_player_samp_value"
            />
            <n-input-group-label>Hz</n-input-group-label>
          </n-input-group>
        </n-space>
      </n-space>
      <n-space justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.gaplessAudio') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.gaplessAudio_description') }}</span>
          </div>
        </n-space>
        <n-select
          v-model:value="store_player_audio_logic.player_gaplessAudio"
          :options="player_gaplessAudio_kind"
          :disabled="store_player_audio_logic.player_select != 'mpv'"
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
            <span style="font-size: 12px">{{ $t('setting.audioExclusiveMode_description') }}</span>
          </div>
        </n-space>
        <n-switch
          :disabled="store_player_audio_logic.player_select != 'mpv'"
          v-model:value="store_player_audio_logic.player_audioExclusiveMode"
        >
        </n-switch>
      </n-space>
      <n-space justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.replayGainMode') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.replayGainMode_description') }}</span>
          </div>
        </n-space>
        <n-select
          v-model:value="store_player_audio_logic.player_replayGainMode"
          :options="player_replayGainMode_kind"
          :disabled="store_player_audio_logic.player_select != 'mpv'"
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
            <span style="font-size: 12px">{{ $t('setting.replayGainPreamp_description') }}</span>
          </div>
        </n-space>
        <n-input-group style="width: 207px; margin-top: -4px">
          <n-input
            clearable
            :disabled="store_player_audio_logic.player_select != 'mpv'"
            default-value="48000"
            v-model:value="store_player_audio_logic.player_replayGainPreamp"
          />
        </n-input-group>
      </n-space>
      <n-space justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('setting.replayGainClipping')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.replayGainClipping_description') }}</span>
          </div>
        </n-space>
        <n-switch
          :disabled="store_player_audio_logic.player_select != 'mpv'"
          v-model:value="store_player_audio_logic.player_replayGainClip"
        >
        </n-switch>
      </n-space>
      <n-space justify="space-between" align="center" style="margin-left: 30px">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('setting.replayGainFallback')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.replayGainFallback_description') }}</span>
          </div>
        </n-space>
        <n-input-group style="width: 207px; margin-top: -4px">
          <n-input
            clearable
            :disabled="store_player_audio_logic.player_select != 'mpv'"
            default-value="48000"
            v-model:value="store_player_audio_logic.player_replayGainFallback"
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
          :disabled="store_player_audio_logic.player_select != 'web'"
          v-model:value="store_player_audio_logic.player_dolby"
          @update:value="update_player_dolby"
        >
        </n-switch>
      </n-space>
      <n-divider v-if="false" style="margin: 0" />
      <n-space v-if="false" justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{ $t('setting.lyricOffset') }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{ $t('setting.lyricOffset_description') }}</span>
          </div>
        </n-space>
        <n-input-group style="width: 207px; margin-top: -4px">
          <n-input clearable default-value="100" />
          <n-input-group-label>ms</n-input-group-label>
        </n-input-group>
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
        <n-switch v-model:value="store_player_appearance.player_use_lottie_animation"> </n-switch>
      </n-space>
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('nsmusics.view_player.view_seting.coverBaseVague') +
            ' ' +
            $t('setting.albumBackground')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('nsmusics.view_player.view_seting.coverBaseVague')
            }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="store_player_appearance.player_use_background_filter_blur" />
      </n-space>
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('Auto') + $t('MediaInfoRotation') + ' ' + $t('setting.albumBackground')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('Auto') + $t('MediaInfoRotation') + ' ' + $t('setting.albumBackground')
            }}</span>
          </div>
        </n-space>
        <n-switch
          v-model:value="store_player_appearance.player_use_background_automatic_rotation"
        />
      </n-space>
      <n-space justify="space-between" align="center">
        <n-space vertical>
          <span style="font-size: 16px; font-weight: 600">{{
            $t('Horizontal') +
            $t('Vertical') +
            $t('AspectRatioFill') +
            ' ' +
            $t('setting.albumBackground')
          }}</span>
          <div style="margin-top: -10px">
            <span style="font-size: 12px">{{
              $t('Horizontal') +
              $t('Vertical') +
              $t('AspectRatioFill') +
              ' ' +
              $t('setting.albumBackground')
            }}</span>
          </div>
        </n-space>
        <n-switch v-model:value="store_player_appearance.player_use_background_repeat_fill" />
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
        <n-switch v-model:value="store_player_appearance.player_use_playbar_auto_hide" />
      </n-space>
    </n-space>
  </n-scrollbar>
</template>

<style scoped></style>
