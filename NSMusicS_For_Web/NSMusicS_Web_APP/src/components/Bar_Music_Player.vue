<script setup lang="ts">
  import { h, ref, watch } from 'vue';

  // send this SetInfo
  import { defineEmits } from 'vue';
  const margin_top_value_view_music_player = ref(670);
  const emits = defineEmits([
    'player_show_height',
    'this_audio_refresh',
    'this_audio_file_path','this_audio_file_medium_image_url',
    'media_file_medium_image_url',
    'this_audio_singer_name',
    'this_audio_song_name',
    'this_audio_album_name','this_audio_album_id','this_audio_album_favite',
    'data_select_Index',
    'isVisible_Music_PlayList','isVisible_Player_Sound_effects',
    'player_show_click',
    'this_audio_lyrics_string',
    'player','currentTime_added_value',
    'view_collapsed_player_bar'
  ]);
  import { defineProps} from 'vue';
  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_refresh',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name',
    'this_audio_album_id','this_audio_album_favite',
    'player_show_click','view_music_player_show_complete',
    'player','play_go_index_time',
    'view_collapsed_player_bar','view_music_player_show'
  ]);
  const { ipcRenderer } = require('electron'); 

  // open view musicplayer
  const svg_shrink_up_arrow = ref<string>('shrink_up_arrow.svg');
  const back_display = ref('none');
  const back_ChevronDouble = ref('../../resources/'+svg_shrink_up_arrow.value)
  const back_filter_blurValue  = ref(0);
  const os = require('os');
  function getAssetImage(firstImage: string) {
    if(os.type() || process.platform === 'win32')
      return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'darwin')
      return new URL(firstImage, import.meta.url).href;
    else if(os.type() || process.platform === 'linux')
      return new URL(firstImage, import.meta.url).href;
  }
  const handleImageError = (event:any) => {
    event.target.src = '../../resources/error_album.jpg'; // 设置备用图片路径
  };
  const hover_back_img = () => {
    back_display.value = 'block';
    back_filter_blurValue.value = 3;
  };
  const leave_back_svg = () => {
    back_display.value = 'none';
    back_filter_blurValue.value = 0;
  };
  const click_back_svg = () => {
    if(props.view_music_player_show_complete){
      margin_top_value_view_music_player.value = 
        margin_top_value_view_music_player.value === 
          0 ? 670 : 0;
          emits('player_show_height',margin_top_value_view_music_player.value);
      if(margin_top_value_view_music_player.value === 0)
        svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
      else
        svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
      back_ChevronDouble.value = '../../resources/'+svg_shrink_up_arrow.value;
      
      musicplayer_background_color.value =
        musicplayer_background_color.value === 
          '#FFFFFF'?'#FFFFFFE5':'#FFFFFF';
    }
  };
  let unwatch_player_show_click = watch(() => props.player_show_click, (newValue, oldValue) => {
    if (newValue === true) {
      margin_top_value_view_music_player.value = 670;
      emits('player_show_height',margin_top_value_view_music_player.value)
      if(margin_top_value_view_music_player.value === 0)
        svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
      else
        svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
      back_ChevronDouble.value = '../../resources/'+svg_shrink_up_arrow.value;

      emits('player_show_click', false);
    }
  });

  // binding
  const musicplayer_background_color = ref('#FFFFFF');
  const total_play_time = ref('04:42');
  const current_play_time = ref('01:36');
  const slider_singleValue = ref(0)
  const currentTime_added_value = ref(0)
  let unwatch_currentTime_added_value = watch(() => currentTime_added_value.value, (newValue, oldValue) => {
    emits('currentTime_added_value',newValue);
  });
  const player_no_progress_jump = ref(true)
  const slider_volume_value = ref(100)
  const slider_volume_show = ref(false)
  const slider_order_show = ref(false)
  // audio player
  const timer_this_audio_refresh = ref<NodeJS.Timeout>();
  const lastTriggerValue = ref<any>(null);// 延迟触发：接收大量数据时，仅触发最后一个值
  let unwatch_this_audio_refresh = watch(() => props.this_audio_refresh, (newValue, oldValue) => {
    if (newValue === true) {
      lastTriggerValue.value = newValue; // 更新最后一个触发的值
      clearTimeout(timer_this_audio_refresh.value);
      // 延迟触发
      timer_this_audio_refresh.value = setTimeout(() => {
        if (newValue === lastTriggerValue.value) { // 检查最后一个触发的值是否与当前触发的值相等
          handleAudioFilePathChange();
          emits('this_audio_refresh', false);
        }
      }, 200);
    }
  });
  const handleAudioFilePathChange = async () => {
    current_play_time.value = formatTime(props.player.getDuration());
    currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    player_no_progress_jump.value = false;
    props.player.isPlaying = false;

    Init_Audio_Player()
  };
  const play_order = ref('playback-2');
  const this_audio_buffer_file = ref<any>()
  const is_play_ended = ref(false);
  const timer_this_audio_player = ref<NodeJS.Timeout>();// 延迟触发：接收大量数据时，仅触发最后一个值
  const { Howl } = require('howler');
  let unwatch_this_audio_buffer_file =  watch(() => this_audio_buffer_file.value, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      props.player.unload();
      ipcRenderer.send('window-gc');
      clearTimeout(timer_this_audio_player.value);
      timer_this_audio_player.value = setTimeout(() => {
        currentTime_added_value.value = 0;
        props.player.howl = new Howl({
          src: [props.this_audio_file_path],
          autoplay: false,
          html5: true,
          loop: false,
          volume: 1.0,
          onplay: () => {
            props.player.isPlaying = true;
          },
          onpause: () => {
            props.player.isPlaying = false;
          },
          onstop: () => {
            props.player.isPlaying = false;
          },
          onend: () => {
            props.player.isPlaying = false;
            //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
            if(player_no_progress_jump.value == true){
              current_play_time.value = formatTime(props.player.getDuration());
              currentTime_added_value.value = 0;
              this_audio_buffer_file.value = null;
              clearInterval(timer);

              player_no_progress_jump.value = false;

              props.player.isPlaying = false;
              is_play_ended.value = true;
            }
            Play_Media_Switching()
          },
          onloaderror: (id: any, error: any) => {
            console.error('Failed to load audio:', error);
            props.player.isPlaying = false;
            //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
            if(player_no_progress_jump.value == true){
              current_play_time.value = formatTime(props.player.getDuration());
              currentTime_added_value.value = 0;
              this_audio_buffer_file.value = null;
              clearInterval(timer);

              player_no_progress_jump.value = false;

              props.player.isPlaying = false;
              is_play_ended.value = true;
            }
            Play_Media_Switching()
          }
        });
        props.player.isPlaying = true;
        is_play_ended.value = false;
        player_no_progress_jump.value = true;
        clearInterval(timer);
        timer = setInterval(synchronize_playback_time, 200);
        total_play_time.value = formatTime(props.player.getDuration());
        props.player.play();
      }, 400);
    }
  });
  const Init_Audio_Player = async () => {
    if(props.player.isPlaying === false){
      if(this_audio_buffer_file.value === null){
        this_audio_buffer_file.value = Math.random().toString(36).substring(7);
      }else{
        props.player.play();
      }
    }else{
      props.player.pause();
    }

    handleRefusetohide();
  };
  ////// play order area
  function Play_Media_Order(model_num: string, increased: number) {
    if (props.playlist_Files_temporary.length > 0) {
      let index = props.playlist_Files_temporary.findIndex((item: any) => item.path === props.this_audio_file_path);
      let stop_play = false;
      if (index !== -1) {
        if (model_num === 'playback-1') {
          index += increased;
          if (index >= props.playlist_Files_temporary.length) {
            if(is_play_ended.value === true){
              stop_play = true;
              is_play_ended.value = false;
            }else{
              index = 0;
            }
          }else if(index < 0){
            index = props.playlist_Files_temporary.length - 1;
          }
        } else if (model_num === 'playback-2') {
          index += increased;
          while (index < 0) {
            index += props.playlist_Files_temporary.length;
          }
          index %= props.playlist_Files_temporary.length;
        } else if (model_num === 'playback-3') {
          if (increased !== 0) {
            index += increased;
            if (index < 0) {
              index = props.playlist_Files_temporary.length - 1;
            } else if (index >= props.playlist_Files_temporary.length) {
              index = 0;
            }
          }
        } else if (model_num === 'playback-4') {
          index = Math.floor(Math.random() * props.playlist_Files_temporary.length);
        } else {
          stop_play = true;
        }

        if (!stop_play) {
          emits('this_audio_file_path', props.playlist_Files_temporary[index].path);
          emits('this_audio_lyrics_string', props.playlist_Files_temporary[index].lyrics);
          emits('this_audio_file_medium_image_url', props.playlist_Files_temporary[index].medium_image_url);
          emits('this_audio_singer_name', props.playlist_Files_temporary[index].artist);
          emits('this_audio_song_name', props.playlist_Files_temporary[index].title);
          emits('this_audio_album_id', props.playlist_Files_temporary[index].album_id);
          emits('this_audio_album_favite', props.playlist_Files_temporary[index].favite);
          emits('this_audio_album_name', props.playlist_Files_temporary[index].album);
          console.log(props.playlist_Files_temporary[index]);
        }
      }
    }

    handleRefusetohide();
  }
  ////// player button area
  const play_skip_back_click = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    Play_Media_Order(play_order.value,-1)
  }
  const play_skip_forward_click = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    Play_Media_Order(play_order.value,1)
  }
  const Play_Media_Switching = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    is_play_ended.value = true;

    if(play_order.value === 'playback-3')
      Play_Media_Order(play_order.value,0)
    else
      Play_Media_Order(play_order.value,1)

    handleRefusetohide();
  };
  ////// player slider formatTime area
  const set_slider_singleValue = () => {
    if ( player_range_duration_isDragging == false) 
      slider_singleValue.value = (props.player.getCurrentTime() + currentTime_added_value.value) / props.player.getDuration() * 100;
  };
  function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    let formattedMinutes = String(minutes);
    let formattedSeconds = String(seconds);

    if(formattedMinutes.length == 1)
      formattedMinutes = '0' + formattedMinutes;
    formattedMinutes = formattedMinutes.replace('.','');
    formattedMinutes = formattedMinutes.substring(0, 2);

    formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
    if(formattedSeconds.length == 1)
      formattedSeconds = '0' + formattedSeconds;
    formattedSeconds = formattedSeconds.substring(0, 2);

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  function formatTime_tooltip(value: number): string {
    return formatTime((value / 100 * props.player.getDuration()));
  }
  const get_current_play_time = () => {
    if((props.player.getCurrentTime() + currentTime_added_value.value) <= props.player.getDuration())
      current_play_time.value = formatTime((props.player.getCurrentTime() + currentTime_added_value.value));
  }
  const synchronize_playback_time = () => {
    set_slider_singleValue();
    get_current_play_time();
  }
  let timer: string | number | NodeJS.Timeout | undefined;
  let player_range_duration_isDragging = false;
  const player_range_duration_handleMouseDown = () => {
    player_range_duration_isDragging = true;

    handleRefusetohide();
  };
  const player_range_duration_handleMouseUp = () => {
    player_range_duration_isDragging = false;

    handleRefusetohide();
  };
  const player_range_duration_handleclick = async () => {
    play_go_duration(slider_singleValue.value,true);

    handleRefusetohide();
  }
  let unwatch_play_go_index_time =  watch(() => props.play_go_index_time, (newValue, oldValue) => {
    play_go_duration(props.play_go_index_time,false)
  });
  const play_go_duration = (slider_value:number,silder_path:boolean) => {
    player_no_progress_jump.value = false;
    currentTime_added_value.value = 0;
    if(props.player.isPlaying === true)
    {
      // 注意，此时currentTime将从0开始，需要计算附加值
      if (silder_path) {
        let newTime = (Number(slider_value) / 100) * props.player.getDuration();
        if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
            props.player.setCurrentTime(newTime);
        } else {
            props.player.setCurrentTime(0);
        }
      } else {
        let newTime = Number(slider_value) / 1000;
        if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
            props.player.setCurrentTime(newTime);
        } else {
            props.player.setCurrentTime(0);
        }
      }
    }

    handleRefusetohide();
  }
  const update_dragend_slider_singleValue = () => {
    if(slider_singleValue.value >= 99.5 || slider_singleValue.value == 0){
      is_play_ended.value = true;
      player_range_duration_handleclick()
    }
    player_range_duration_isDragging = false;

    handleRefusetohide();
  };

  // player voice area
  const backpanel_voice_click = () => {
    if(slider_volume_show.value){
      slider_volume_show.value = false;
    }else{
      slider_volume_show.value = true;
    }

    handleRefusetohide();
  }
  let unwatch_slider_volume_value = watch(
    slider_volume_value,
    (newValue, oldValue) => {
      props.player.setVolume(newValue ? Number(slider_volume_value.value) : 0);
    },
    { immediate: true }
  );

  // player order area
  const backpanel_order_click = () => {
    if(slider_order_show.value){
      slider_order_show.value = false;
    }else{
      slider_order_show.value = true;
    }

    handleRefusetohide();
  }
  const options_Order = [
    { label: '顺序播放', key: 'playback-1', 
      icon() {
        return h(NIcon, null, {
          default: () => h(ArrowAutofitDown24Regular)
        });
      } 
    },
    { label: '列表循环', key: 'playback-2', 
      icon() {
        return h(NIcon, null, {
          default: () => h(ArrowRepeatAll16Regular)
        });
      }
    },
    { label: '单曲循环', key: 'playback-3', 
      icon() {
        return h(NIcon, null, {
          default: () => h(RepeatOneRound)
        });
      }
    },
    { label: '随机播放', key: 'playback-4', 
      icon() {
        return h(NIcon, { size: '12px' }, {
          default: () => h(Random)
        });
      }
    }
  ];
  const handleSelect_Order = (value: any) => {
    console.log(value);
    play_order.value = value;

    handleRefusetohide();
  }

  // open playList
  const Set_isVisible_Music_PlayList = () => {
    emits('isVisible_Music_PlayList',true);

    handleRefusetohide();
  }
  // open sound effects
  const Set_isVisible_Player_Sound_effects= () => {
    emits('isVisible_Player_Sound_effects',true);

    handleRefusetohide();
  }

  import { onBeforeUnmount } from 'vue';
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
  onBeforeUnmount(() => {
    unwatch_player_show_click()
    unwatch_currentTime_added_value()
    unwatch_this_audio_refresh()
    unwatch_this_audio_buffer_file()
    unwatch_play_go_index_time()
    unwatch_slider_volume_value()
  });
  import {
    Heart24Regular,Heart28Filled,
    Video16Regular,
    DesktopFlow24Regular,
    MoreCircle32Regular,
    ArrowRepeatAll16Regular,ArrowAutofitDown24Regular,
    ChevronDoubleDown16Filled,ChevronDoubleUp16Filled,
    TopSpeed20Regular,DeviceEq24Filled
  } from '@vicons/fluent'
  import {
    QueueMusicRound,
    RepeatOneRound
  } from '@vicons/material' 
  import {
    ReorderFour,
    Play,Pause,
    PlaySkipBack,PlaySkipForward,
    VolumeMedium,
  } from '@vicons/ionicons5' 
  import {
    Random
  } from '@vicons/fa'
  import { NIcon } from 'naive-ui';

  ////// auto collapse player bar
  const handleRefusetohide = () => {
    emits('view_collapsed_player_bar', false);
  };
  const handleShow = () => {
    if(props.view_music_player_show === true)
      emits('view_collapsed_player_bar', true)
  }; 
</script>

<template>
  <n-space class="this_Bar_Music_Player"
    style="transition: margin 0.4s;"
    :style="{ marginBottom: view_collapsed_player_bar ? '-80px' : '0px' }"
    @mousemove="handleRefusetohide" @mouseenter="handleRefusetohide" @mouseover="handleRefusetohide" 
    @mouseleave="handleShow">
    <div class="layout_distribution_3">
      <div class="gird_Left">
        <div class="button_open_player_view">
          <img class="back_svg"
              :src="back_ChevronDouble"
              :style="{ display: back_display }"
              @click="click_back_svg" @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
              
          <img class="back_img" 
              :src="getAssetImage(props.this_audio_file_medium_image_url)"
              @error="handleImageError"
              :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
              style="objectFit: cover; objectPosition: center;"
              @click="click_back_svg"
              @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
        </div>
        <div class="bar_left_text_song_info">
          <n-space>
            <n-ellipsis>
              <span id="bar_song_name">{{ props.this_audio_song_name + '&nbsp-&nbsp' }}</span>
              <template v-for="artist in props.this_audio_singer_name.split(/[\/|｜]/)">
                <span id="bar_singer_name_part">{{ artist + '&nbsp' }}</span>
              </template>
            </n-ellipsis>
          </n-space>
          <n-space>
            <n-ellipsis id="bar_album_name">{{ props.this_audio_album_name }}</n-ellipsis>
          </n-space>
        </div>
      </div>
      <div class="gird_Middle">
        <n-space class="grid_Middle_button_area" justify="center">
          <n-dropdown 
            trigger="click" :show-arrow="true" :options="options_Order" @select="handleSelect_Order">
            <n-button quaternary round size="small">
              <template #icon>
                <n-icon :size="26" v-if="play_order === 'playback-1'">
                  <ArrowAutofitDown24Regular/>
                </n-icon>
                <n-icon :size="26" v-else-if="play_order === 'playback-2'">
                  <ArrowRepeatAll16Regular/>
                </n-icon>
                <n-icon :size="26" v-else-if="play_order === 'playback-3'">
                  <RepeatOneRound/>
                </n-icon>
                <n-icon :size="20" v-else-if="play_order === 'playback-4'">
                  <Random/>
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
          <n-button quaternary round size="small" @click="play_skip_back_click">
            <template #icon>
              <n-icon :size="26"><PlaySkipBack/></n-icon>
            </template>
          </n-button>
          <n-button quaternary round size="medium" @click="Init_Audio_Player">
            <template #icon>
              <n-icon v-if="props.player.isPlaying" :size="36"><Pause/></n-icon>
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
        <div>
          <n-slider 
            style="
              width: 90%;
              margin-left:5%;margin-top:8px;
              color: #3DC3FF;
              border-radius: 10px;
            "
            v-model:value="slider_singleValue" :on-dragend="update_dragend_slider_singleValue"
            :min="0" :max="100" :keyboard="true" :format-tooltip="formatTime_tooltip"
            @mousedown="player_range_duration_handleMouseDown"
            @mouseup="player_range_duration_handleMouseUp"
            @click="player_range_duration_handleclick"
            />
        </div>
        <div>
          <!-- :class="{ show: slider_volume_show }" -->
          <div id="backpanel_voice" 
            v-if="slider_volume_show">
            <input id="player_range_voice" type="range"
              style="height: 90%;bottom: 20;"
              :min="0" :max="100" :hideTip="true" v-model.value="slider_volume_value"/>
            <h4>{{ slider_volume_value }}%</h4>
          </div>
        </div>
      </div>
      <div class="gird_Right">
        <n-space class="gird_Right_current_playlist_button_area">
          <n-badge :value="props.playlist_Files_temporary.length" show-zero :max="9999" :offset="[-7, 3]">
            <n-button strong secondary class="gird_Right_current_playlist_button_area_of_button" @click="Set_isVisible_Music_PlayList">
              <template #icon>
                <n-icon :size="42"><QueueMusicRound/></n-icon>
              </template>
            </n-button>
          </n-badge>
        </n-space>   
        <div class="gird_Right_button_area">
          <n-space justify="space-between">
            <n-button size="tiny" text>
              <template #icon>
                <n-icon v-if="props.this_audio_album_favite" :size="22" color="red"><Heart28Filled/></n-icon>
                <n-icon v-else :size="22"><Heart24Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text>
              <template #icon>
                <n-icon :size="22"><MoreCircle32Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_isVisible_Music_PlayList">
              <template #icon>
                <n-icon :size="22"><TopSpeed20Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_isVisible_Music_PlayList">
              <template #icon>
                <n-icon :size="22"><DeviceEq24Filled/></n-icon>
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
  border-radius: 12px 12px 0px 0px;
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
  width: 380px;
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
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
  z-index: 0;
}

.gird_Left .bar_left_text_song_info{
  width: 280px;
  height: 50px;
  margin-top: 12px;margin-left: 14px;
  float: left;text-align: left;
}
.gird_Left .bar_left_text_song_info #bar_song_name{
  font-size: 18px;
  font-weight: 600;
  max-width: 240px;
}
.gird_Left .bar_left_text_song_info #bar_song_name:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_singer_name_part {
  font-size: 16px;
  font-weight: 500;
}
.gird_Left .bar_left_text_song_info #bar_singer_name_part:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_album_name{
  font-size: 16px;
  font-weight: 600;
  max-width: 240px;
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
  margin: 0px auto;
  margin-top: 10px;
}
.gird_Middle #backpanel_order{
  position: absolute;
  top: -200px;
  margin-left: 30px;
  width: 100px;
  height: 210px;
  background-color: #FFFFFF;
  border-radius: 10px;
  border: #283248 1px solid;
}
.gird_Middle #backpanel_voice{
  position: absolute;
  top: -202px;
  margin-left: 290px;
  width: 60px;
  height: 210px;
  background-color: #FFFFFF;
  border-radius: 10px;
}
.gird_Middle #backpanel_voice #player_range_voice{
  height: 80px;
  width: 160px;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  margin-left: -50px;
}
.gird_Middle #backpanel_voice h4{
  color: #283248;
  margin-top: -16px;
}
.gird_Right {
  width: 380px;
  height: 80px;
  margin-right: 12px;
  
  cursor: default;
  user-select: none;
}
.gird_Right .gird_Right_button_area{
  width: 50px;
  height: 80px;
  float: right;
  margin-top: 16px;
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
.gird_Right .gird_Right_audio_play_time_area{
  height: 80px;
  float: right;
  margin-right: 56px;
}
.gird_Right .gird_Right_audio_play_time_area #current_play_time{
  font-size: 16px;
  position: absolute;
  top: 10px;
}
.gird_Right .gird_Right_audio_play_time_area #divider_play_time{
  position: absolute;
  top: 28px;
}
.gird_Right .gird_Right_audio_play_time_area #total_play_time{
  font-size: 16px;
  position: absolute;
  bottom: 10px;
}
.gird_Right .gird_Right_sound_effects_button_area{
  width: 30px;
  height: 30px;
  float: right;
  margin-top: 24px;
  margin-right: 10px;
  border-radius: 10px;
}
.gird_Right .gird_Right_speed_effects_button_area{
  width: 30px;
  height: 30px;
  border-radius: 10px;
}
.gird_Right .gird_Right_sound_speed_button_area{
  width: 30px;
  height: 30px;
  float: right;
  margin-top: 24px;
  margin-right: 2px;
  border-radius: 10px;
}

</style>