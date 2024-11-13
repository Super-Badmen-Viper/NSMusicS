<script setup lang="ts">
////// this_view resource of icons_svg
import {
  Heart24Regular,Heart28Filled,
  MoreCircle32Regular,
  ArrowRepeatAll16Regular,ArrowAutofitDown24Regular,
  TopSpeed20Regular,DeviceEq24Filled,Tag16Regular,Info16Regular
} from '@vicons/fluent'
import {
  RepeatOneRound,QueueMusicRound
} from '@vicons/material'
import {
  Play,Pause,
  PlaySkipBack,PlaySkipForward,
  VolumeMedium,
} from '@vicons/ionicons5'
import {
  Random
} from '@vicons/fa'
import { NIcon, NSlider, NSpace, NText } from 'naive-ui';

////// this_view components of navie_ui
import {onMounted, ref, watch, inject} from 'vue';
import {onBeforeUnmount} from 'vue';
const {ipcRenderer} = require('electron');
const get_playerbar_to_switch_playerview = inject('get_playerbar_to_switch_playerview');

import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})

//////
const os = require('os');
function getAssetImage(firstImage: string) {
  if(os.type() || process.platform === 'win32')
    return new URL(firstImage, import.meta.url).href;
  else if(os.type() || process.platform === 'darwin')
    return new URL(firstImage, import.meta.url).href;
  else if(os.type() || process.platform === 'linux')
    return new URL(firstImage, import.meta.url).href;
}
const path = require('path')
const handleImageError = (event: any) => {
  const originalSrc = event.target.src;
  const pngSrc = originalSrc.replace(/\.[^/.]+$/, '.png');
  const img = new Image();
  img.onload = null;
  img.onerror = null;
  img.onload = () => {
    event.target.src = pngSrc;
  };
  img.onerror = () => {
    event.target.src = path.resolve('resources/img/error_album.jpg');
  };
  img.src = pngSrc;
};


////// open view musicplayer
const player_show_hight_animation_value = ref(670);
const svg_shrink_up_arrow = ref<string>('shrink_up_arrow.svg');
const back_display = ref('none');
const back_ChevronDouble = ref('../../resources/svg/'+svg_shrink_up_arrow.value)
const back_filter_blurValue  = ref(0);
const hover_back_img = () => {
  back_display.value = 'block';
  back_filter_blurValue.value = 3;
};
const leave_back_svg = () => {
  back_display.value = 'none';
  back_filter_blurValue.value = 0;
};
const click_back_svg = () => {
  if(store_player_appearance.player_show_complete){
    player_show_hight_animation_value.value =
        player_show_hight_animation_value.value ===
        0 ? 670 : 0;
    get_playerbar_to_switch_playerview(player_show_hight_animation_value.value);
    if(player_show_hight_animation_value.value === 0)
      svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
    else
      svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
    back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
  }
};
let unwatch_player_show_click = watch(() => store_player_appearance.player_show_click, (newValue) => {
  if (newValue === true) {
    player_show_hight_animation_value.value = 670;
    get_playerbar_to_switch_playerview(player_show_hight_animation_value.value)
    if(player_show_hight_animation_value.value === 0)
      svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
    else
      svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
    back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;

    store_player_appearance.player_show_click = false
  }
});

////// audio_player
const timer_this_audio_restart_play = ref<NodeJS.Timeout>();
const lastTriggerValue = ref<any>(null);// 延迟触发：接收大量数据时，仅触发最后一个值
let unwatch_this_audio_restart_play = watch(() => store_player_audio_info.this_audio_restart_play, (newValue) => {
  if (newValue === true) {
    lastTriggerValue.value = newValue; // 更新最后一个触发的值
    clearTimeout(timer_this_audio_restart_play.value);
    // 延迟触发
    timer_this_audio_restart_play.value = setTimeout(() => {
      if (newValue === lastTriggerValue.value) { // 检查最后一个触发的值是否与当前触发的值相等
        handleAudioFilePathChange();
        store_player_audio_info.this_audio_restart_play = false
      }
    }, 200);
  }
});
const handleAudioFilePathChange = async () => {
  if(store_player_audio_logic.this_audio_initial_trigger) {
    store_player_audio_logic.current_play_time = formatTime(await store_player_audio_logic.player.getDuration());
    store_player_audio_logic.player_silder_currentTime_added_value = 0;
    this_audio_buffer_file.value = null;
    store_player_audio_logic.player_no_progress_jump = false;
    store_player_audio_logic.player.isPlaying = false;

    await Init_Audio_Player()
  }
  // Prevent triggering events captured by "vue3 watch" during data initialization
  store_player_audio_logic.this_audio_initial_trigger = true
};
const this_audio_buffer_file = ref<any>()
const is_play_ended = ref(false);
const timer_this_audio_player = ref<NodeJS.Timeout>();// 延迟触发：接收大量数据时，仅触发最后一个值
const { Howl } = require('howler');
let unwatch_this_audio_buffer_file =  watch(() => this_audio_buffer_file.value, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    Play_This_Audio_Path()
  }
  const { webFrame } = require('electron');
  webFrame.clearCache();
});
const Play_This_Audio_Path = () => {
  clearTimeout(timer_this_audio_player.value);
  timer_this_audio_player.value = setTimeout(async () => {
    if(store_player_audio_info.this_audio_file_path.length > 0) {
      store_player_audio_logic.player_silder_currentTime_added_value = 0;
      if(store_player_audio_logic.player_select === 'mpv'){
        if(store_player_audio_logic.player === null){
          store_player_audio_logic.player = new Audio_node_mpv()
        }
        await store_player_audio_logic.player.load(store_player_audio_info.this_audio_file_path)
      }
      else if(store_player_audio_logic.player_select === 'web'){
        if(store_player_audio_logic.player.howl != null){
          await store_player_audio_logic.player.howl.unload()
        }
        let media_kind = ''
        if(store_server_user_model.model_server_type_of_local){
          media_kind = store_player_audio_info.this_audio_file_path.split('.').pop()
        }else if(store_server_user_model.model_server_type_of_web){
          media_kind = 'mp3'
        }
        store_player_audio_logic.player = new Audio_howler()
        store_player_audio_logic.player.howl = new Howl({
          src: [store_player_audio_info.this_audio_file_path],
          format: store_player_audio_logic.player_dolby ?
              ['dolby', media_kind]
              :
              [],
          autoplay: false,
          html5: true,
          loop: false,
          volume: 1.0,
          onplay: async () => {
            store_player_audio_logic.player.howl.fade(0, 1, store_player_audio_logic.player_fade_value);
            store_player_audio_logic.player.isPlaying = true;
            await ipcRenderer.invoke('i18n-tray-music-pause', true)
          },
          onpause: async () => {
            store_player_audio_logic.player.isPlaying = false;
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
          },
          onstop: async () => {
            store_player_audio_logic.player.isPlaying = false;
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
          },
          onend: () => {
            store_player_audio_logic.player.howl.fade(1, 0, store_player_audio_logic.player_fade_value);
            setTimeout(async () => {
              store_player_audio_logic.player.isPlaying = false;
              //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
              if(store_player_audio_logic.player_no_progress_jump){
                store_player_audio_logic.current_play_time = formatTime(store_player_audio_logic.player.getDuration());
                store_player_audio_logic.player_silder_currentTime_added_value = 0;
                this_audio_buffer_file.value = null;
                clearInterval(timer);

                store_player_audio_logic.player_no_progress_jump = false;

                store_player_audio_logic.player.isPlaying = false;
                is_play_ended.value = true;
              }
              Play_Media_Switching()
            }, store_player_audio_logic.player_fade_value);
          },
          onloaderror: (id: any, error: any) => {
            // console.error('Failed to load audio:', error);
            store_player_audio_logic.player.isPlaying = false;
          }
        });
      }
      store_player_audio_logic.player.isPlaying = true;
      store_player_audio_info.this_audio_is_playing = true
      store_player_audio_logic.player_save_new_data = true
      is_play_ended.value = false;
      store_player_audio_logic.player_no_progress_jump = true;
      //
      clearInterval(timer);
      timer = setInterval(
          synchronize_playback_time, 200
      );
      await store_player_audio_logic.player.setVolume(
          Number(store_player_audio_logic.play_volume)
      )
      await store_player_audio_logic.player.play();
      store_player_audio_logic.total_play_time = formatTime(
          await store_player_audio_logic.player.getDuration()
      );

      store_local_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File(
          store_player_audio_info.this_audio_song_id
      )
    }
  }, 400);
}
/// Prevent 'mpv stopped' from being triggered multiple times and implement anti shake throttling measures
import { debounce } from 'lodash';
const handleMpvStopped = debounce(async (event, args) => {
  is_play_ended.value = true;
  let index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
      (item: any) =>
          item.play_id ===
          store_player_audio_info.this_audio_play_id
  );
  let last_play = false;
  if (store_server_user_model.model_server_type_of_local) {
    last_play = index >= store_playlist_list_info.playlist_MediaFiles_temporary.length - 1;
  } else if (store_server_user_model.model_server_type_of_web) {
    last_play = index >= store_playlist_list_fetchData._totalCount - 1;
  }
  if (last_play && store_player_audio_logic.play_order === 'playback-1') {
    await store_player_audio_logic.player.pause();
    store_player_audio_info.this_audio_is_playing = false;
  } else {
    store_player_audio_logic.player.isPlaying = false;
    store_player_audio_info.this_audio_is_playing = false;
    // 无进度跳动: 若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
    if (store_player_audio_logic.player_no_progress_jump) {
      store_player_audio_logic.current_play_time = formatTime(store_player_audio_logic.player.getDuration());
      store_player_audio_logic.player_silder_currentTime_added_value = 0;
      this_audio_buffer_file.value = null;
      clearInterval(timer);

      store_player_audio_logic.player_no_progress_jump = false;

      store_player_audio_logic.player.isPlaying = false;
      store_player_audio_info.this_audio_is_playing = false;
    }
    Play_Media_Switching()
  }
}, 300);// 300ms 的防抖时间，限制node-mpv频繁触发end事件
ipcRenderer.on('mpv-stopped', handleMpvStopped);
///
onMounted(async () => {
  timer = setInterval(synchronize_playback_time, 200);
  await store_player_audio_logic.player.IsPlaying()
  await store_player_audio_logic.player.setVolume(Number(store_player_audio_logic.play_volume))
})
let init_play = true;
const Init_Audio_Player = async () => {
  if(store_player_audio_info.this_audio_file_path.length > 0){
    if(init_play){
      Play_This_Audio_Path()
      init_play = false
    }
    if(!store_player_audio_logic.player.isPlaying){
      if(this_audio_buffer_file.value === null){
        this_audio_buffer_file.value = Math.random().toString(36).substring(7);
      }
      else{
        store_player_audio_info.this_audio_is_playing = true
        store_player_audio_logic.player.isPlaying = true;
        if(store_player_audio_logic.player_select === 'mpv'){
          if(!store_player_audio_logic.player.isPlaying)
            Play_This_Audio_Path()
          else {
            await ipcRenderer.invoke('mpv-startFadeIn', store_player_audio_logic.play_volume)
          }
        }
        else if(store_player_audio_logic.player_select === 'web'){
          if(store_player_audio_logic.player.howl == null)
            Play_This_Audio_Path()
          else {
            store_player_audio_logic.player.howl.fade(1, 0, store_player_audio_logic.player_fade_value);
            setTimeout(async () => {
              await store_player_audio_logic.player.play();
            }, 200);
          }
        }
      }
    }
    else{
      store_player_audio_info.this_audio_is_playing = false
      store_player_audio_logic.player.isPlaying = false
      if(store_player_audio_logic.player_select === 'mpv'){
        await ipcRenderer.invoke('mpv-startFadeOut', store_player_audio_logic.play_volume)
      }
      else if(store_player_audio_logic.player_select === 'web'){
        store_player_audio_logic.player.howl.fade(1, 0, store_player_audio_logic.player_fade_value);
        setTimeout(async () => {
          await store_player_audio_logic.player.pause();
        }, store_player_audio_logic.player_fade_value);
      }
    }
  }
};
//////
ipcRenderer.on('tray-music-pause', Init_Audio_Player);
ipcRenderer.on('tray-music-order', (event, order) => {
  store_player_audio_logic.play_order = order;
});
////// player_configs player_button order area
import { useMessage } from 'naive-ui'
const message = useMessage()
const backpanel_order_leave = () => {
  if(store_player_appearance.player_show === false) {
    store_player_audio_logic.drawer_order_show = false;
  }
}
const backpanel_order_hover = () => {
  store_player_audio_logic.drawer_order_show = true;
}
const backpanel_order_click = () => {
  store_player_audio_logic.drawer_order_show = true;
  const orders = ['playback-1', 'playback-2', 'playback-3', 'playback-4'];
  if (!store_player_audio_logic.play_order) {
    store_player_audio_logic.play_order = orders[0];
  } else {
    const currentIndex = orders.indexOf(store_player_audio_logic.play_order);
    const nextIndex = (currentIndex + 1) % orders.length;
    store_player_audio_logic.play_order = orders[nextIndex];
  }

  ipcRenderer.invoke('i18n-tray-music-order',
      store_player_audio_logic.play_order
  );

  switch (store_player_audio_logic.play_order) {
    case 'playback-1':
      message.success(t('nsmusics.siderbar_player.playback_1'));
      break;
    case 'playback-2':
      message.success(t('nsmusics.siderbar_player.playback_2'));
      break;
    case 'playback-3':
      message.success(t('nsmusics.siderbar_player.playback_3'));
      break;
    case 'playback-4':
      message.success(t('nsmusics.siderbar_player.playback_4'));
      break;
    default:
      message.success(t('nsmusics.siderbar_player.playback_3'));
      break;
  }
};
async function Play_Media_Order(model_num: string, increased: number) {
  let last_index = 0
  if(store_server_user_model.model_server_type_of_local){
    last_index = store_playlist_list_info.playlist_MediaFiles_temporary.length
  }else if(store_server_user_model.model_server_type_of_web){
    last_index = store_playlist_list_fetchData._totalCount || store_playlist_list_info.playlist_MediaFiles_temporary.length
  }
  if (last_index > 0) {
    let index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
        (item: any) =>
            item.play_id ===
            store_player_audio_info.this_audio_play_id
    );
    let stop_play = false;
    if (index !== -1) {
      if (model_num === 'playback-1') {
        index += increased;
        if (index >= last_index) {
          if(is_play_ended.value === true){
            stop_play = true;
            is_play_ended.value = false;
          }else{
            index = 0;
          }
        }else if(index < 0){
          index = last_index - 1;
        }
      } else if (model_num === 'playback-2') {
        index += increased;
        if (index >= last_index) {
          index = 0;
        }else if(index < 0){
          index = last_index - 1;
        }
      } else if (model_num === 'playback-3') {
        if (increased !== 0) {
          index += increased;
          if (index < 0) {
            index = last_index - 1;
          } else if (index >= last_index) {
            index = 0;
          }
        }
      } else if (model_num === 'playback-4') {
        index = Math.floor(
            Math.random() * store_playlist_list_info.playlist_MediaFiles_temporary.length
        );
      } else {
        stop_play = true;
      }

      if (!stop_play) {
        if (store_server_user_model.model_server_type_of_web) {
          if (index >= store_playlist_list_info.playlist_MediaFiles_temporary.length) {
            await store_playlist_list_fetchData.fetchData_PlayList_of_server_web_end();
          }
        }
        const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[index]
        store_player_audio_info.this_audio_play_id = media_file.play_id
        store_player_audio_info.this_audio_file_path = media_file.path;
        store_player_audio_info.this_audio_lyrics_string = media_file.lyrics
        store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url;
        store_player_audio_info.this_audio_artist_name = media_file.artist;
        store_player_audio_info.this_audio_artist_id = media_file.artist_id
        store_player_audio_info.this_audio_song_name = media_file.title
        store_player_audio_info.this_audio_song_id = media_file.id
        store_player_audio_info.this_audio_song_rating = media_file.rating
        store_player_audio_info.this_audio_song_favorite = media_file.favorite
        store_player_audio_info.this_audio_album_id = media_file.album_id
        store_player_audio_info.this_audio_album_name = media_file.album
        //
        store_player_tag_modify.player_current_media_starred = media_file.favorite
        store_player_tag_modify.player_current_media_playCount = media_file.play_count
        store_player_tag_modify.player_current_media_playDate = media_file.play_date
        //
        store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = index
        console.log(media_file);

        store_playlist_list_logic.media_page_handleItemDbClick = false
        // store_player_appearance.player_mode_of_lock_playlist = false
        store_player_audio_info.this_audio_restart_play = true
      }
    }
  }
}
////// player_configs player_button middle area
const play_skip_back_click = async () => {
  store_player_audio_logic.current_play_time = formatTime(await store_player_audio_logic.player.getDuration());
  store_player_audio_logic.player_silder_currentTime_added_value = 0;
  this_audio_buffer_file.value = null;
  clearInterval(timer);

  store_player_audio_logic.player_no_progress_jump = false;

  store_player_audio_logic.player.isPlaying = false;
  Play_Media_Order(store_player_audio_logic.play_order, -1)

  store_player_appearance.player_mode_of_lock_playlist = true
}
const play_skip_forward_click = async () => {
  store_player_audio_logic.current_play_time = formatTime(await store_player_audio_logic.player.getDuration());
  store_player_audio_logic.player_silder_currentTime_added_value = 0;
  this_audio_buffer_file.value = null;
  clearInterval(timer);

  store_player_audio_logic.player_no_progress_jump = false;

  store_player_audio_logic.player.isPlaying = false;
  Play_Media_Order(store_player_audio_logic.play_order, 1)

  store_player_appearance.player_mode_of_lock_playlist = true
}
ipcRenderer.on('tray-music-prev',
    debounce(async (event, args) => {await play_skip_back_click(), 300})
);
ipcRenderer.on('tray-music-next',
    debounce(async (event, args) => {await play_skip_forward_click(), 300})
);
const Play_Media_Switching = async () => {
  store_player_audio_logic.current_play_time = formatTime(await store_player_audio_logic.player.getDuration());
  store_player_audio_logic.player_silder_currentTime_added_value = 0;
  this_audio_buffer_file.value = null;
  clearInterval(timer);

  store_player_audio_logic.player_no_progress_jump = false;

  store_player_audio_logic.player.isPlaying = false;
  is_play_ended.value = true;

  if (store_player_audio_logic.play_order === 'playback-3')
    Play_Media_Order(store_player_audio_logic.play_order, 0)
  else
    Play_Media_Order(store_player_audio_logic.play_order, 1)
};
////// player_configs player_button voice area
const backpanel_voice_click = () => {
  store_player_audio_logic.drawer_volume_show = !store_player_audio_logic.drawer_volume_show;
}

////// player_configs slider formatTime area
const set_slider_singleValue = async () => {
  if (!player_range_duration_isDragging) {
    const currentTime = await store_player_audio_logic.player.getCurrentTime();
    const duration = await store_player_audio_logic.player.getDuration();
    const calculatedValue = ((currentTime + store_player_audio_logic.player_silder_currentTime_added_value) / duration) * 100;
    store_player_audio_logic.slider_singleValue = Number(calculatedValue.toFixed(2));
  }
};
function formatTime(currentTime: number): string {
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);

  let formattedMinutes = String(minutes);
  let formattedSeconds = String(seconds);

  if (formattedMinutes.length == 1)
    formattedMinutes = '0' + formattedMinutes;

  if (formattedSeconds.length == 1)
    formattedSeconds = '0' + formattedSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}
function formatTime_tooltip(value: number){
  return formatTime((value / 100 * store_player_audio_logic.player.isDuration));
}
const get_current_play_time = async () => {
  if ((await store_player_audio_logic.player.getCurrentTime() + store_player_audio_logic.player_silder_currentTime_added_value) <= await store_player_audio_logic.player.getDuration())
    store_player_audio_logic.current_play_time = formatTime((await store_player_audio_logic.player.getCurrentTime() + store_player_audio_logic.player_silder_currentTime_added_value));
}
const synchronize_playback_time = () => {
  try {
    set_slider_singleValue();
    get_current_play_time();
  }catch{}
}
let timer: string | number | NodeJS.Timeout | undefined;
let player_range_duration_isDragging = false;
const player_range_duration_handleMouseDown = () => {
  player_range_duration_isDragging = true;
};
const player_range_duration_handleMouseUp = () => {
  player_range_duration_isDragging = false;
};
const player_range_duration_handleclick = async () => {
  play_go_duration(store_player_audio_logic.slider_singleValue,true);
}
let unwatch_play_go_index_time =  watch(() => store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress, () => {
  play_go_duration(store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress,false)
});
const play_go_duration = async (slider_value: number, silder_path: boolean) => {
  store_player_audio_logic.player_no_progress_jump = false;
  store_player_audio_logic.player_silder_currentTime_added_value = 0;
  if (store_player_audio_logic.player.isPlaying === true) {
    // 注意，此时currentTime将从0开始，需要计算附加值
    if (silder_path) {
      let newTime = (Number(slider_value) / 100) * await store_player_audio_logic.player.getDuration();
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        store_player_audio_logic.player.setCurrentTime(newTime);
      } else {
        store_player_audio_logic.player.setCurrentTime(0);
      }
    } else {
      let newTime = Number(slider_value) / 1000;
      if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
        store_player_audio_logic.player.setCurrentTime(newTime);
      } else {
        store_player_audio_logic.player.setCurrentTime(0);
      }
    }
  }
}
const update_dragend_slider_singleValue = () => {
  if(store_player_audio_logic.slider_singleValue >= 99.5 || store_player_audio_logic.slider_singleValue == 0){
    is_play_ended.value = true;
    player_range_duration_handleclick()
  }
  player_range_duration_isDragging = false;
};

////// open playList
const Set_Playlist_Show = () => {
  store_playlist_appearance.playlist_show = true
}
////// open sound effects
const Set_Player_Show_Sound_effects= () => {
  store_player_sound_effects.player_show_sound_effects = !store_player_sound_effects.player_show_sound_effects;
}
////// open sound speedPlayer_Show_Sound_more
const Set_Player_Show_Sound_speed= () => {
  store_player_sound_speed.player_show_sound_speed = store_player_sound_speed.player_show_sound_speed === false;
}
////// open sound more info
const Set_Player_Show_Sound_more= () => {
  store_player_sound_more.player_show_sound_more = store_player_sound_more.player_show_sound_more === false;
}

////// auto collapse player_configs bar
const handleRefusetohide = () => {
  store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false;
};
const handleMouseMove = () => {
  if(store_player_appearance.player_show === true){
    if(store_player_appearance.player_use_playbar_auto_hide) {
      store_player_appearance.player_collapsed_action_bar_of_Immersion_model = true
    }
    store_player_audio_logic.drawer_order_show = false;
    store_player_audio_logic.drawer_volume_show = false;
  }
};

////// changed_data write to sqlite
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {store_player_sound_effects} from "@/store/player/store_player_sound_effects";
import {store_player_sound_speed} from "@/store/player/store_player_sound_speed";
import {store_player_sound_more} from "@/store/player/store_player_sound_more";
import {store_playlist_appearance} from '@/store/view/playlist/store_playlist_appearance'
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info"
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";
import {Audio_howler} from "@/models/song_Audio_Out/Audio_howler";
import {Audio_node_mpv} from "@/models/song_Audio_Out/Audio_node_mpv";
import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id,favorite)
  store_player_audio_info.this_audio_song_favorite = !favorite
}
const handleItemClick_Rating = (id: any,rating: any) => {
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating);
  store_player_audio_info.this_audio_song_rating = rating
}

/////// emits audio_info of songlist_view_list
const handleItemClick_title = (title:string) => {
  store_view_media_page_logic.page_songlists_bool_show_search_area = true
  store_view_media_page_logic.page_songlists_input_search_Value = title
  store_view_media_page_logic.get_page_songlists_keyword(title)
  player_show_hight_animation_value.value = 670;
  get_playerbar_to_switch_playerview(player_show_hight_animation_value.value);
  if(player_show_hight_animation_value.value === 0)
    svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
  else
    svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
  back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
}
const handleItemClick_artist = (artist:string) => {
  store_view_media_page_logic.page_songlists_bool_show_search_area = true
  store_view_media_page_logic.page_songlists_input_search_Value = artist
  if(store_server_user_model.model_server_type_of_local) {
    store_view_media_page_logic.get_page_songlists_keyword(artist + 'accurate_search' + '__artist__')
  }else if(store_server_user_model.model_server_type_of_web){
    store_view_media_page_logic.get_page_songlists_keyword(artist)
  }
  player_show_hight_animation_value.value = 670;
  get_playerbar_to_switch_playerview(player_show_hight_animation_value.value);
  if(player_show_hight_animation_value.value === 0)
    svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
  else
    svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
  back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
}
const handleItemClick_album = (album:string) => {
  store_view_media_page_logic.page_songlists_bool_show_search_area = true
  store_view_media_page_logic.page_songlists_input_search_Value = album
  if(store_server_user_model.model_server_type_of_local) {
    store_view_media_page_logic.get_page_songlists_keyword(album+'accurate_search'+'__album__')
  }else if(store_server_user_model.model_server_type_of_web){
    store_view_media_page_logic.get_page_songlists_keyword(album)
  }
  player_show_hight_animation_value.value = 670;
  get_playerbar_to_switch_playerview(player_show_hight_animation_value.value);
  if(player_show_hight_animation_value.value === 0)
    svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
  else
    svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
  back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
}

////// view albumlist_view Remove data
onBeforeUnmount(() => {
  clearInterval(timer);
});
onBeforeUnmount(() => {
  unwatch_player_show_click()
  unwatch_this_audio_restart_play()
  unwatch_this_audio_buffer_file()
  unwatch_play_go_index_time()
});
</script>
<template>
  <n-space
      class="this_Bar_Music_Player"
      style="transition: margin 0.4s;"
      :style="{ marginBottom: store_player_appearance.player_collapsed_action_bar_of_Immersion_model ? '-80px' : '0px' }"
      @mousemove="handleRefusetohide" @mouseleave="handleMouseMove" @mouseover="handleRefusetohide">
    <div
        class="layout_distribution_3"
        style="transition: margin 0.4s;"
        :style="{
        marginLeft: store_player_appearance.player_show ? '0px' : (store_app_configs_info.app_left_menu_collapsed ? '72px' : '166px'),
        width: store_player_appearance.player_show ? '100vw' : (store_app_configs_info.app_left_menu_collapsed ? 'calc(100vw - 72px)' : 'calc(100vw - 167px)'),
      }">
      <div class="gird_Left">
        <div class="button_open_player_view">
          <img class="back_svg"
               :src="back_ChevronDouble"
               :style="{ display: back_display }"
               @click="click_back_svg" @mouseover="hover_back_img" @mouseout="leave_back_svg" alt=""/>
          <img class="back_img"
               :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
               @error="handleImageError"
               :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
               style="objectFit: cover; objectPosition: center;"
               @click="click_back_svg"
               @mouseover="hover_back_img" @mouseout="leave_back_svg" alt=""/>
        </div>
        <div class="bar_left_text_song_info">
          <n-space>
            <n-ellipsis>
              <span id="bar_song_name" @click="handleItemClick_title(store_player_audio_info.this_audio_song_name)">{{ store_player_audio_info.this_audio_song_name + '&nbsp-&nbsp' }}</span>
              <template v-for="artist in store_player_audio_info.this_audio_artist_name.split(/[\/|｜]/)">
                <span id="bar_artist_name_part" @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
              </template>
            </n-ellipsis>
          </n-space>
          <n-space>
            <n-ellipsis>
              <span id="bar_album_name"
                    @click="() => {
                      if(store_server_user_model.model_server_type_of_local){
                        handleItemClick_album(store_player_audio_info.this_audio_album_id)
                      }else if(store_server_user_model.model_server_type_of_web){
                        handleItemClick_album(store_player_audio_info.this_audio_album_name)
                      }
                    }"
              >{{ store_player_audio_info.this_audio_album_name }}</span>
            </n-ellipsis>
          </n-space>
        </div>
      </div>
      <div class="gird_Middle">
        <!-- grid_Middle_button_area -->
        <n-space class="grid_Middle_button_area" justify="center">
          <n-button quaternary round size="small"
                    @click="backpanel_order_click" @mouseover="backpanel_order_hover">
            <template #icon>
              <n-icon :size="26" v-if="store_player_audio_logic.play_order === 'playback-1'">
                <ArrowAutofitDown24Regular/>
              </n-icon>
              <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-2'">
                <ArrowRepeatAll16Regular/>
              </n-icon>
              <n-icon :size="26" v-else-if="store_player_audio_logic.play_order === 'playback-3'">
                <RepeatOneRound/>
              </n-icon>
              <n-icon :size="20" v-else-if="store_player_audio_logic.play_order === 'playback-4'">
                <Random/>
              </n-icon>
            </template>
          </n-button>
          <n-button quaternary round size="small" @click="play_skip_back_click">
            <template #icon>
              <n-icon :size="26"><PlaySkipBack/></n-icon>
            </template>
          </n-button>
          <n-button quaternary round size="medium" @click="Init_Audio_Player">
            <template #icon>
              <n-icon v-if="store_player_audio_logic.player.isPlaying" :size="36"><Pause/></n-icon>
              <n-icon v-else :size="36"><Play/></n-icon>
            </template>
          </n-button>
          <n-button quaternary round size="small" @click="play_skip_forward_click">
            <template #icon>
              <n-icon :size="26"><PlaySkipForward/></n-icon>
            </template>
          </n-button>
          <n-button quaternary round size="small" @click="backpanel_voice_click">
            <template #icon>
              <n-icon :size="26"><VolumeMedium/></n-icon>
            </template>
          </n-button>
        </n-space>
        <!-- grid_Middle_slider_area -->
        <div>
          <n-slider
              style="
              width: 90%;
              margin-left:5%;margin-top:8px;
              color: #3DC3FF;
              border-radius: 10px;
            "
              v-model:value="store_player_audio_logic.slider_singleValue" :on-dragend="update_dragend_slider_singleValue"
              :min="0" :max="100" :keyboard="true"
              :format-tooltip="formatTime_tooltip"
              @mousedown="player_range_duration_handleMouseDown"
              @mouseup="player_range_duration_handleMouseUp"
              @click="player_range_duration_handleclick"
          />
        </div>
        <!-- grid_Middle_drwaer_area -->
        <n-config-provider :theme="null" v-if="false">
          <div id="backpanel_order" @mouseleave="backpanel_order_leave"></div>
          <n-drawer
              v-model:show="store_player_audio_logic.drawer_order_show"
              placement="bottom"
              to="#backpanel_order"
              :height="160"
              show-mask="transparent"
              style="border-radius: 10px;">
            <n-drawer-content>
              <n-space vertical style="height: 100px;">
                <n-radio-group v-model:value="store_player_audio_logic.play_order" name="play_order_group">
                  <n-space style="margin-left: -10px;">
                    <n-radio value="playback-1">
                      <template #default>
                        <n-button quaternary style="margin-left: -16px; margin-top: -6px;width: 100px;">
                          <template #icon>
                            <n-icon>
                              <ArrowAutofitDown24Regular />
                            </n-icon>
                          </template>
                          {{$t('nsmusics.siderbar_player.playback_1')}}
                        </n-button>
                      </template>
                    </n-radio>
                    <n-radio value="playback-2">
                      <template #default>
                        <n-button quaternary style="margin-left: -16px; margin-top: -6px;">
                          <template #icon>
                            <n-icon>
                              <ArrowRepeatAll16Regular />
                            </n-icon>
                          </template>
                          {{$t('nsmusics.siderbar_player.playback_2')}}
                        </n-button>
                      </template>
                    </n-radio>
                    <n-radio value="playback-3">
                      <template #default>
                        <n-button quaternary style="margin-left: -16px; margin-top: -6px;">
                          <template #icon>
                            <n-icon>
                              <RepeatOneRound />
                            </n-icon>
                          </template>
                          {{$t('nsmusics.siderbar_player.playback_3')}}
                        </n-button>
                      </template>
                    </n-radio>
                    <n-radio value="playback-4">
                      <template #default>
                        <n-button quaternary style="margin-left: -16px; margin-top: -6px;">
                          <template #icon>
                            <n-icon :size="12">
                              <Random />
                            </n-icon>
                          </template>
                          {{$t('nsmusics.siderbar_player.playback_4')}}
                        </n-button>
                      </template>
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-space>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
        <n-config-provider :theme="null">
          <div id="backpanel_voice"></div>
          <n-drawer
              v-model:show="store_player_audio_logic.drawer_volume_show"
              placement="bottom"
              :width="77"
              :height="236"
              to="#backpanel_voice"
              show-mask="transparent"
              style="border-radius: 10px;"
          >
            <n-drawer-content>
              <n-space vertical justify="center" align="center" >
                <n-slider
                    style="
                    height: 158px;
                    border-radius: 10px;
                    margin-top: 6px;
                  "
                    vertical
                    v-model:value="store_player_audio_logic.play_volume"
                    :min="0" :max="100" :keyboard="true" :tooltip="false"
                />
                <n-text>{{ store_player_audio_logic.play_volume }}</n-text>
              </n-space>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
      </div>
      <div class="gird_Right">
        <n-space class="gird_Right_current_playlist_button_area">
          <n-badge :value="store_playlist_list_info.playlist_MediaFiles_temporary.length" show-zero :max="9999" :offset="[-7, 3]">
            <n-button strong secondary class="gird_Right_current_playlist_button_area_of_button" @click="Set_Playlist_Show">
              <template #icon>
                <n-icon :size="42"><QueueMusicRound/></n-icon>
              </template>
            </n-button>
          </n-badge>
        </n-space>
        <div class="gird_Right_button_area" style="margin-top: 16px;">
          <n-space justify="end">
            <n-rate clearable size="small"
                    v-model:value="store_player_audio_info.this_audio_song_rating"
                    @update:value="(value: number) => handleItemClick_Rating(store_player_audio_info.this_audio_song_id, value)"/>
          </n-space>
          <n-space justify="space-between" style="margin-top: 6px;">
            <n-button size="tiny" text
                      @click="() => {
                        store_player_tag_modify.player_current_media_path = store_player_audio_info.this_audio_file_path
                        store_player_tag_modify.player_current_media_id = store_player_audio_info.this_audio_song_id
                        store_player_tag_modify.player_current_album_id = store_player_audio_info.this_audio_album_id
                        store_player_tag_modify.player_current_artist_id = store_player_audio_info.this_audio_artist_id
                        //
                        store_player_tag_modify.player_show_tag_modify = !store_player_tag_modify.player_show_tag_modify
                      }">
              <template #icon>
                <n-icon :size="22"><Tag16Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="handleItemClick_Favorite(store_player_audio_info.this_audio_song_id,store_player_audio_info.this_audio_song_favorite);">
              <template #icon>
                <n-icon v-if="store_player_audio_info.this_audio_song_favorite" :size="22" color="red"><Heart28Filled/></n-icon>
                <n-icon v-else :size="22"><Heart24Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_effects">
              <template #icon>
                <n-icon :size="22"><DeviceEq24Filled/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_speed">
              <template #icon>
                <n-icon :size="22"><TopSpeed20Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_more">
              <template #icon>
                <n-icon :size="22"><MoreCircle32Regular/></n-icon>
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
  </n-space>
</template>
<style>
.this_Bar_Music_Player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  z-index: 100;
  border-radius: 12px 12px 0 0;
}

.layout_distribution_3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw; /* 设置为 auto 即为单分布，100vw 为多分布(左，中，右) */

  height: 80px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 99;
}

.gird_Left {
  width: 300px;
  height: 80px;
  margin-left: 12px;

  cursor: default;
  user-select: none;
}
.gird_Left .button_open_player_view{
  width: 60px;height: 60px;
  margin-top: 10px;margin-left: 20px;
  float: left;
}
.gird_Left .button_open_player_view .back_svg{
  width: 45px;height: 45px;
  border-radius: 10px;
  margin-left: 7.5px;margin-top: 7.5px;
  position: absolute;
  z-index: 1;
}
.gird_Left .button_open_player_view .back_img{
  width: 60px;height: 60px;
  border-radius: 6px;
  border: 1.5px solid #FFFFFF20;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
  z-index: 0;
}
.gird_Left .bar_left_text_song_info{
  width: 150px;
  height: 50px;
  margin-top: 12px;margin-left: 14px;
  float: left;text-align: left;
}
.gird_Left .bar_left_text_song_info #bar_song_name{
  font-size: 18px;
  font-weight: 600;
  max-width: 150px;
}
.gird_Left .bar_left_text_song_info #bar_song_name:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_artist_name_part {
  font-size: 16px;
  font-weight: 500;
}
.gird_Left .bar_left_text_song_info #bar_artist_name_part:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_album_name{
  font-size: 16px;
  font-weight: 600;
  max-width: 150px;
}
.gird_Left .bar_left_text_song_info #bar_album_name:hover {
  text-decoration: underline;
  color: #3DC3FF;
}


.gird_Middle {
  width: 400px;
  height: 80px;
  align-items: center;
}
.gird_Middle .grid_Middle_button_area{
  display: flex;
  align-items: center;
  width: 300px;
  margin: 10px auto 0;
}
.gird_Middle #backpanel_order{
  position: absolute;
  bottom: 80px;
  margin-left: 30px;
  min-width: 142px;
  width: auto;
  border-radius: 10px;
  pointer-events: none;
}
.gird_Middle #backpanel_voice{
  position: fixed;
  bottom: 80px;
  margin-left: 280px;
  width: 77px;
  height: 100px;
  border-radius: 10px;
  pointer-events: none;
}

.gird_Right {
  width: 300px;
  height: 80px;
  margin-right: 12px;

  cursor: default;
  user-select: none;
}
.gird_Right .gird_Right_button_area{
  width: 132px;
  height: 80px;
  float: right;
  margin-right: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area{
  width: 60px;
  height: 60px;
  float: right;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border-radius: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area_of_button{
  width: 60px;
  height: 60px;
  border-radius: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area_of_button :hover{
  color: #3DC3FF;
}
</style>