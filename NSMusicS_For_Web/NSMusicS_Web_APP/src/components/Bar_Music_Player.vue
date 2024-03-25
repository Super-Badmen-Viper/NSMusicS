<script setup lang="ts">
  import { h, ref, watch } from 'vue';

  // send this SetInfo
  import { defineEmits } from 'vue';
  const margin_top_value_view_music_player = ref(670);
  const emit = defineEmits([
    'on-click',
    'this_audio_refresh',
    'this_audio_file_path','this_audio_file_medium_image_url',
    'media_file_medium_image_url',
    'this_audio_singer_name',
    'this_audio_song_name',
    'this_audio_album_name',
    'data_select_Index',
    'isVisible_Music_PlayList'
  ]);

  // open view musicplayer
  const svg_shrink_up_arrow = ref<string>('shrink_up_arrow.svg');
  const svg_shrink_down_arrow = ref<string>('shrink_down_arrow.svg');
  const back_display = ref('none');
  const back_filter_blurValue  = ref(0);
  function getAssetImage(firstImage: string) {
    return new URL(firstImage, import.meta.url).href;
  }
  let path = require('path');
  function getAssetImage_SVG(firstImage: string) {
    return new URL(path.resolve(process.cwd(), 'resources') + '\\'+firstImage).href;
  }
  const hover_back_img = () => {
    back_display.value = 'block';
    back_filter_blurValue.value = 3;
  };
  const leave_back_svg = () => {
    back_display.value = 'none';
    back_filter_blurValue.value = 0;
  };
  const click_back_svg = () => {
    svg_shrink_up_arrow.value = 
    svg_shrink_up_arrow.value === 
      'shrink_up_arrow.svg' ? svg_shrink_down_arrow.value : 'shrink_up_arrow.svg';

    margin_top_value_view_music_player.value = 
      margin_top_value_view_music_player.value === 
        0 ? 670 : 0;
        emit('on-click',margin_top_value_view_music_player.value);
    
    // musicplayer_background_color.value =
    //   musicplayer_background_color.value === 
    //     '#FFFFFF'?'#FFFFFFE5':'#FFFFFF';
  };

  // binding
  // const musicplayer_background_color = ref('#FFFFFF');
  const this_audio_buffer_file = ref(null)
  import { defineProps} from 'vue';
  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_refresh',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name']);
  const timer_this_audio_refresh = ref<NodeJS.Timeout>();
  const lastTriggerValue = ref<any>(null);// 接收大量数据时，仅触发最后一个值
  watch(() => props.this_audio_refresh, (newValue, oldValue) => {
    if (newValue === true) {
      lastTriggerValue.value = newValue; // 更新最后一个触发的值
      clearTimeout(timer_this_audio_refresh.value);
      // 延迟触发
      timer_this_audio_refresh.value = setTimeout(() => {
        if (newValue === lastTriggerValue.value) { // 检查最后一个触发的值是否与当前触发的值相等
          handleAudioFilePathChange();
          emit('this_audio_refresh', false);
        }
      }, 200);
    }
  });
  const handleAudioFilePathChange = async () => {
    current_play_time.value = formatTime(player.getTotalTime());
    currentTime_added_value.value = 0;
    player.releaseMemory(true);
    this_audio_buffer_file.value = null;
    player_no_progress_jump.value = false;
    player.isPlaying = false;

    player = new Audio_Players(); // restart player
    buffer_init.value = false;
    Init_Audio_Player()
  };
  const total_play_time = ref('04:42');
  const current_play_time = ref('01:36');
  const slider_singleValue = ref(0)
  const currentTime_added_value = ref(0)
  const player_no_progress_jump = ref(true)
  //
  const slider_volume_value = ref(100)
  const slider_volume_show = ref(false)
  //
  const slider_order_show = ref(false)

  // audio system
  import { Audio_Players } from '../models/song_Audio_Out/Audio_Players';
  const { ipcRenderer } = require('electron');
  let player = new Audio_Players();
  const play_order = ref('playback-2');
  const is_play_ended = ref(false);
  const buffer_init = ref(false);
  const Init_Audio_Player = async () => {
    if(player.isPlaying === false){
      if(this_audio_buffer_file.value === null){
        buffer_init.value = true;
        this_audio_buffer_file.value = await ipcRenderer.invoke('readFile', props.this_audio_file_path);
        if(buffer_init.value === true){
          currentTime_added_value.value = 0;
          player.releaseMemory(true);
          player.loadAudio(this_audio_buffer_file.value,true).then(() => {
            if(player.bufferSourceNode != null){
              player.setVolume(Number(slider_volume_value.value));
              player.setFadein();
              player.setFadeout();
              player.audioContext.resume();
              player.bufferSourceNode.addEventListener('ended', () => {
                //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
                if(player_no_progress_jump.value == true){
                  current_play_time.value = formatTime(player.getTotalTime());
                  currentTime_added_value.value = 0;
                  player.releaseMemory(true);
                  clearInterval(timer);
                  this_audio_buffer_file.value = null

                  player_no_progress_jump.value = false;

                  player.isPlaying = false;
                  is_play_ended.value = true;
                }
                Play_Media_Switching()
              });
              
              try {
                player.bufferSourceNode.start(player.audioContext.currentTime, player.startTime, player.audioDuration);
              }catch (error) {
                console.log(error);
                setTimeout(() => {
                  handleAudioFilePathChange();
                }, 200);
              }

              player.isPlaying = true;
              is_play_ended.value = false;
              player_no_progress_jump.value = true;
              clearInterval(timer);
              timer = setInterval(synchronize_playback_time, 200);
              total_play_time.value = formatTime(player.getTotalTime());
            }
          });
        }
      }else{
        player.resume();
      }
    }else{
      player.pause();
    }
  };
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
          emit('this_audio_file_path', props.playlist_Files_temporary[index].path);
          emit('this_audio_file_medium_image_url', props.playlist_Files_temporary[index].medium_image_url);
          emit('this_audio_singer_name', props.playlist_Files_temporary[index].artist);
          emit('this_audio_song_name', props.playlist_Files_temporary[index].title);
          emit('this_audio_album_name', props.playlist_Files_temporary[index].album);
          console.log(props.playlist_Files_temporary[index]);
        }
      }
    }
  }
  const play_skip_back_click = () => {
    current_play_time.value = formatTime(player.getTotalTime());
    currentTime_added_value.value = 0;
    player.releaseMemory(true);
    clearInterval(timer);
    this_audio_buffer_file.value = null

    player_no_progress_jump.value = false;

    player.isPlaying = false;
    Play_Media_Order(play_order.value,-1)
  }
  const play_skip_forward_click = () => {
    current_play_time.value = formatTime(player.getTotalTime());
    currentTime_added_value.value = 0;
    player.releaseMemory(true);
    clearInterval(timer);
    this_audio_buffer_file.value = null

    player_no_progress_jump.value = false;

    player.isPlaying = false;
    Play_Media_Order(play_order.value,1)
  }
  
  const throttleDuration = 1000; // 节流的时间间隔，单位为毫秒
  let lastTriggerTime = 0; // 上次触发的时间戳
  const Play_Media_Switching = () => {
    const currentTime = Date.now();
    if (currentTime - lastTriggerTime > throttleDuration) {
      // 在节流时间间隔内首次触发
      lastTriggerTime = currentTime;
      if(slider_singleValue.value >= 99 && player.getTotalTime() != 0){
        current_play_time.value = formatTime(player.getTotalTime());
        currentTime_added_value.value = 0;
        player.releaseMemory(true);
        clearInterval(timer);
        this_audio_buffer_file.value = null

        player_no_progress_jump.value = false;

        player.isPlaying = false;
        is_play_ended.value = true;

        if(play_order.value === 'playback-3')
          Play_Media_Order(play_order.value,0)
        else
          Play_Media_Order(play_order.value,1)
      }
    }
  };

  // player slider formatTime area
  const set_slider_singleValue = () => {
    if ( player_range_duration_isDragging == false) 
      slider_singleValue.value = (player.getCurrentTime() + currentTime_added_value.value) / player.getTotalTime() * 100;
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
    return formatTime((value / 100 * player.getTotalTime()));
  }
  const get_current_play_time = () => {
    if((player.getCurrentTime() + currentTime_added_value.value) <= player.getTotalTime())
      current_play_time.value = formatTime((player.getCurrentTime() + currentTime_added_value.value));
  }
  const synchronize_playback_time = () => {
    set_slider_singleValue();
    get_current_play_time();
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
    player_no_progress_jump.value = false;
    player.releaseMemory(false);
    player.loadAudio( this_audio_buffer_file.value,false).then(() => {
      if(player.bufferSourceNode != null){
        player.setVolume(Number(slider_volume_value.value));
        player.setFadein();
        player.setFadeout();
        player.audioContext.resume();
        player.bufferSourceNode.addEventListener('ended', () => {
          //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
          if(player_no_progress_jump.value == true){
            current_play_time.value = formatTime(player.getTotalTime());
            currentTime_added_value.value = 0;
            player.releaseMemory(true);
            clearInterval(timer);
            this_audio_buffer_file.value = null

            player_no_progress_jump.value = false;

            player.isPlaying = false;
            is_play_ended.value = true;
          }
          
          Play_Media_Switching()
        });
        player.isPlaying = true;
        is_play_ended.value = false;
        clearInterval(timer);
        timer = setInterval(synchronize_playback_time, 200);
        total_play_time.value = formatTime(player.getTotalTime());

        // 注意，此时currentTime将从0开始，需要计算附加值
        let newtime = (Number(slider_singleValue.value) / 100) * player.audioDuration;
        if(Number(slider_singleValue.value) != 0 && Number(slider_singleValue.value) != 100){
          player.bufferSourceNode.start(0,newtime);
          currentTime_added_value.value = newtime;
        }
        else{
          player.bufferSourceNode.start(player.audioContext.currentTime, player.startTime, player.audioDuration);
          currentTime_added_value.value = 0;
        }
      }
    });
  }
  const update_dragend_slider_singleValue = () => {
    if(slider_singleValue.value >= 99.5 || slider_singleValue.value == 0){
      is_play_ended.value = true;
      player_range_duration_handleclick()
    }
    player_range_duration_isDragging = false;
  };

  // player voice area
  const backpanel_voice_click = () => {
    if(slider_volume_show.value){
      slider_volume_show.value = false;
    }else{
      slider_volume_show.value = true;
    }
  }
  watch(
    slider_volume_value,
    (newValue, oldValue) => {
      player.setVolume(newValue ? Number(slider_volume_value.value) : 0);
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
  }

  // open playList
  // const isVisible_Music_PlayList = ref(false);
  const Set_isVisible_Music_PlayList = () => {
    emit('isVisible_Music_PlayList',true);
  }

  import {
    Heart24Regular,
    Video16Regular,
    DesktopFlow24Regular,
    MoreCircle32Regular,
    ArrowRepeatAll16Regular,ArrowAutofitDown24Regular,
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
</script>

<template>
  <n-space class="this_Bar_Music_Player">
    <div class="layout_distribution_3">
      <div class="gird_Left">
        <div class="button_open_player_view">
          <img class="back_svg" 
              :src="getAssetImage_SVG(svg_shrink_up_arrow)" 
              :style="{ display: back_display }"
              @click="click_back_svg" @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
          <img class="back_img" 
              :src="getAssetImage(props.this_audio_file_medium_image_url)"
              :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
              @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
        </div>
        <div class="bar_left_text_song_info">
          <n-ellipsis id="bar_song_name">{{ props.this_audio_song_name }}</n-ellipsis>
          <n-ellipsis id="bar_singer_name">{{ props.this_audio_singer_name }}</n-ellipsis>  
          <n-ellipsis id="bar_album_name">{{ props.this_audio_album_name }}</n-ellipsis>
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
              <n-icon v-if="player.isPlaying" :size="36"><Pause/></n-icon>
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
          <div class="gird_Right_button_area_up">
            <n-button size="tiny" text>
              <template #icon>
                <n-icon :size="22"><Heart24Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text>
              <template #icon>
                <n-icon :size="22"><Video16Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text>
              <template #icon>
                <n-icon :size="22"><DesktopFlow24Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text>
              <template #icon>
                <n-icon :size="22"><MoreCircle32Regular/></n-icon>
              </template>
            </n-button>
          </div>
          <div class="gird_Right_button_area_down">
            <n-button size="tiny" secondary strong id="button_audio_speed">
              <n-ellipsis>倍速</n-ellipsis>
            </n-button>
            <n-button size="tiny" secondary strong id="button_sound_effects">
              <n-ellipsis>音效</n-ellipsis>
            </n-button>
          </div>
        </div>
        <div class="gird_Right_audio_play_time_area">
          <div>
            <n-ellipsis id="current_play_time">{{ current_play_time }}</n-ellipsis><br>
            <n-ellipsis id="divider_play_time"> ------ </n-ellipsis><br>
            <n-ellipsis id="total_play_time">{{ total_play_time }}</n-ellipsis>
          </div>
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
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
  z-index: 0;
}
.gird_Left .bar_left_text_song_info{
  width: 280px;
  height: 56px;
  margin-top: 3px;margin-left: 14px;
  float: left;text-align: left;
}
.gird_Left .bar_left_text_song_info #bar_singer_name{
  font-size: 16px;
  font-weight: 500;
  user-select: none;
  max-width: 240px;
  /* 行数超出后显示省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.gird_Left .bar_left_text_song_info #bar_singer_name:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_song_name{
  font-size: 14px;
  font-weight: 500;
  max-width: 240px;
  /* 行数超出后显示省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.gird_Left .bar_left_text_song_info #bar_song_name:hover {
  text-decoration: underline;
  color: #3DC3FF;
}
.gird_Left .bar_left_text_song_info #bar_album_name{
  font-size: 14px;
  font-weight: 500;
  max-width: 240px;
  /* 行数超出后显示省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  overflow: hidden;
  text-overflow: ellipsis;
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
  
  cursor: default;
  user-select: none;
}
.gird_Right .gird_Right_audio_play_time_area{
  width: 130px;
  height: 80px;
  float: right;
}
.gird_Right .gird_Right_audio_play_time_area div{
  width: 130px;
  height: 30px;
  margin-top: 12px;
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
.gird_Right .gird_Right_button_area{
  width: 130px;
  height: 80px;
  float: right;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up{
  margin-top: 10px;
  width: 130px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down{
  width: 110px;
  height: 30px;
  margin-top: 6px;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_audio_speed{
  width: 40px;height: 22px;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_audio_speed :hover{
  color: #3DC3FF;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_sound_effects{
  width: 40px;
  width: 40px;height: 22px;
  margin-left: 10px;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_sound_effects :hover{
  color: #3DC3FF;
}
.gird_Right .gird_Right_current_playlist_button_area{
  width: 60px;
  height: 60px;
  float: right;
  margin-top: 10px;
  margin-left: 20px;
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