<script setup lang="ts">
  ////// this_view resource of icons_svg
  import {
    Heart24Regular,Heart28Filled,
    MoreCircle32Regular,
    ArrowRepeatAll16Regular,ArrowAutofitDown24Regular,
    TopSpeed20Regular,DeviceEq24Filled
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
  import { ref, watch } from 'vue';
  import { defineEmits } from 'vue';
  import { onBeforeUnmount } from 'vue';
  const { ipcRenderer } = require('electron');

  ////// passed as argument
  const emits = defineEmits([
    'player_show_height',
    'this_audio_restart_play',
    'this_audio_file_path','this_audio_file_medium_image_url',
    'media_file_medium_image_url',
    'page_songlists_keyword',
    'this_audio_singer_name','this_audio_singer_id',
    'this_audio_song_name','this_audio_song_id','this_audio_song_rating','this_audio_song_favorite',
    'this_audio_album_name','this_audio_album_id',
    'this_audio_Index_of_absolute_positioning_in_list',
    'Playlist_Show','Player_Show_Sound_effects','Player_Show_Sound_speed','Player_Show_Sound_more',
    'player_show_click',
    'this_audio_lyrics_string',
    'player','player_save_new_data','this_audio_is_playing','player_silder_currentTime_added_value',
    'player_collapsed_action_bar_of_Immersion_model'
  ]);
  import { defineProps} from 'vue';
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_restart_play',
    'this_audio_singer_name','this_audio_singer_id',
    'this_audio_song_name','this_audio_song_id','this_audio_song_rating','this_audio_song_favorite',
    'this_audio_album_name','this_audio_album_id',
    'player_show_click','player_show_complete','Player_Show_Sound_effects','Player_Show_Sound_speed','Player_Show_Sound_more',
    'player','player_fade_value','player_go_lyricline_index_of_audio_play_progress',
    'player_collapsed_action_bar_of_Immersion_model','player_show','collapsed'
  ]);

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
  const handleImageError = (event:any) => {
    event.target.src = '../../resources/img/error_album.jpg'; // 设置备用图片路径
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
    if(props.player_show_complete){
      player_show_hight_animation_value.value = 
        player_show_hight_animation_value.value === 
          0 ? 670 : 0;
          emits('player_show_height',player_show_hight_animation_value.value);
      if(player_show_hight_animation_value.value === 0)
        svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
      else
        svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
      back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
    }
  };
  let unwatch_player_show_click = watch(() => props.player_show_click, (newValue) => {
    if (newValue === true) {
      player_show_hight_animation_value.value = 670;
      emits('player_show_height',player_show_hight_animation_value.value)
      if(player_show_hight_animation_value.value === 0)
        svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
      else
        svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
      back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;

      emits('player_show_click', false);
    }
  });
  
  ////// audio_player
  const timer_this_audio_restart_play = ref<NodeJS.Timeout>();
  const lastTriggerValue = ref<any>(null);// 延迟触发：接收大量数据时，仅触发最后一个值
  let unwatch_this_audio_restart_play = watch(() => props.this_audio_restart_play, (newValue) => {
    if (newValue === true) {
      lastTriggerValue.value = newValue; // 更新最后一个触发的值
      clearTimeout(timer_this_audio_restart_play.value);
      // 延迟触发
      timer_this_audio_restart_play.value = setTimeout(() => {
        if (newValue === lastTriggerValue.value) { // 检查最后一个触发的值是否与当前触发的值相等
          handleAudioFilePathChange();
          emits('this_audio_restart_play', false);
        }
      }, 200);
    }
  });
  const handleAudioFilePathChange = async () => {
    if(store_player_audio_info.this_audio_initial_trigger) {
      current_play_time.value = formatTime(props.player.getDuration());
      player_silder_currentTime_added_value.value = 0;
      this_audio_buffer_file.value = null;
      player_no_progress_jump.value = false;
      props.player.isPlaying = false;

      await Init_Audio_Player()
    }
    // Prevent triggering events captured by "vue3 watch" during data initialization
    store_player_audio_info.this_audio_initial_trigger = true
  };
  const play_order = ref('playback-2');
  const this_audio_buffer_file = ref<any>()
  const is_play_ended = ref(false);
  const timer_this_audio_player = ref<NodeJS.Timeout>();// 延迟触发：接收大量数据时，仅触发最后一个值
  const { Howl } = require('../../types/howler');
  let unwatch_this_audio_buffer_file =  watch(() => this_audio_buffer_file.value, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      Play_This_Audio_Path()
    }
    const { webFrame } = require('electron');
    webFrame.clearCache();
  });
  function Play_This_Audio_Path(){
    props.player.unload();
    clearTimeout(timer_this_audio_player.value);
    timer_this_audio_player.value = setTimeout(() => {
      player_silder_currentTime_added_value.value = 0;
      props.player.howl = new Howl({
        src: [props.this_audio_file_path],
        autoplay: false,
        html5: true,
        loop: false,
        volume: 1.0,
        onplay: () => {
          props.player.howl.fade(0, 1, props.player_fade_value);
          props.player.isPlaying = true;
          emits('this_audio_is_playing',true)
        },
        onpause: () => {
          props.player.howl.fade(1, 0, props.player_fade_value);
          props.player.isPlaying = false;
          emits('this_audio_is_playing',false)
        },
        onstop: () => {
          props.player.howl.fade(1, 0, props.player_fade_value);
          props.player.isPlaying = false;
          emits('this_audio_is_playing',false)
        },
        onend: () => {
          props.player.howl.fade(1, 0, props.player_fade_value);
          props.player.isPlaying = false;
          emits('this_audio_is_playing',false)
          //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
          if(player_no_progress_jump.value == true){
            current_play_time.value = formatTime(props.player.getDuration());
            player_silder_currentTime_added_value.value = 0;
            this_audio_buffer_file.value = null;
            clearInterval(timer);

            player_no_progress_jump.value = false;

            props.player.isPlaying = false;
            emits('this_audio_is_playing',false)
            is_play_ended.value = true;
          }
          Play_Media_Switching()
        },
        onloaderror: (id: any, error: any) => {
          console.error('Failed to load audio:', error);
          props.player.isPlaying = false;
          emits('this_audio_is_playing',false)
          //无进度跳动:若调整进度，则会误触发end此事件，加player_no_progress_jump判断解决
          if(player_no_progress_jump.value == true){
            current_play_time.value = formatTime(props.player.getDuration());
            player_silder_currentTime_added_value.value = 0;
            this_audio_buffer_file.value = null;
            clearInterval(timer);

            player_no_progress_jump.value = false;

            props.player.isPlaying = false;
            emits('this_audio_is_playing',false)
            is_play_ended.value = true;
          }
          Play_Media_Switching()
        }
      });
      props.player.isPlaying = true;
      emits('this_audio_is_playing',true)
      emits('player_save_new_data',true)
      is_play_ended.value = false;
      player_no_progress_jump.value = true;
      clearInterval(timer);
      timer = setInterval(synchronize_playback_time, 200);
      total_play_time.value = formatTime(props.player.getDuration());
      props.player.setVolume(Number(store_player_audio_logic.play_volume / 100))
      props.player.play();
      // animationInstance.value.play();
    }, 400);
  }
  const Init_Audio_Player = async () => {
    if(props.this_audio_file_path.length > 0){
      if(props.player.isPlaying === false){
        if(this_audio_buffer_file.value === null){
          this_audio_buffer_file.value = Math.random().toString(36).substring(7);
        }else{
          if(props.player.howl == null)
            Play_This_Audio_Path()
          else {
            props.player.play();
            // animationInstance.value.play();
          }
          emits('this_audio_is_playing',true)
        }
      }else{
        props.player.pause();
        // animationInstance.value.pause();
        emits('this_audio_is_playing',false)
      }
    }
  };
  ////// audio_player of silder
  const total_play_time = ref('04:42');
  const current_play_time = ref('01:36');
  const slider_singleValue = ref(0)
  const player_silder_currentTime_added_value = ref(0)
  let unwatch_player_silder_currentTime_added_value = watch(() => player_silder_currentTime_added_value.value, (newValue) => {
    emits('player_silder_currentTime_added_value',newValue);
  });
  const player_no_progress_jump = ref(true)

  ////// player_configs player_button order area
  const drawer_order_show = ref(false)
  const backpanel_order_click = () => {
    drawer_order_show.value = !drawer_order_show.value;
  }
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
          emits('this_audio_singer_id', props.playlist_Files_temporary[index].artist_id);
          emits('this_audio_song_name', props.playlist_Files_temporary[index].title);
          emits('this_audio_song_id', props.playlist_Files_temporary[index].id);
          emits('this_audio_song_rating', props.playlist_Files_temporary[index].rating);
          emits('this_audio_song_favorite', props.playlist_Files_temporary[index].favorite);
          emits('this_audio_album_id', props.playlist_Files_temporary[index].album_id);
          emits('this_audio_album_name', props.playlist_Files_temporary[index].album);
          emits('this_audio_Index_of_absolute_positioning_in_list',index)
          console.log(props.playlist_Files_temporary[index]);
        }
      }
    }
  }
  ////// player_configs player_button middle area
  const play_skip_back_click = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    player_silder_currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    Play_Media_Order(play_order.value,-1)
  }
  const play_skip_forward_click = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    player_silder_currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    Play_Media_Order(play_order.value,1)
  }
  const Play_Media_Switching = () => {
    current_play_time.value = formatTime(props.player.getDuration());
    player_silder_currentTime_added_value.value = 0;
    this_audio_buffer_file.value = null;
    clearInterval(timer);

    player_no_progress_jump.value = false;

    props.player.isPlaying = false;
    is_play_ended.value = true;

    if(play_order.value === 'playback-3')
      Play_Media_Order(play_order.value,0)
    else
      Play_Media_Order(play_order.value,1)
  };
  ////// player_configs player_button voice area
  const drawer_volume_show = ref(false)
  const backpanel_voice_click = () => {
    drawer_volume_show.value = !drawer_volume_show.value;
  }
  let unwatch_slider_volume_value = watch(
    store_player_audio_logic.play_volume,
    (newValue) => {
      props.player.setVolume(newValue ? Number(store_player_audio_logic.play_volume / 100) : 0);
    },
    { immediate: true }
  );

  ////// player_configs slider formatTime area
  const set_slider_singleValue = () => {
    if (!player_range_duration_isDragging)
      slider_singleValue.value = (props.player.getCurrentTime() + player_silder_currentTime_added_value.value) / props.player.getDuration() * 100;
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
    if((props.player.getCurrentTime() + player_silder_currentTime_added_value.value) <= props.player.getDuration())
      current_play_time.value = formatTime((props.player.getCurrentTime() + player_silder_currentTime_added_value.value));
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
    play_go_duration(slider_singleValue.value,true);
  }
  let unwatch_play_go_index_time =  watch(() => props.player_go_lyricline_index_of_audio_play_progress, () => {
    play_go_duration(props.player_go_lyricline_index_of_audio_play_progress,false)
  });
  const play_go_duration = (slider_value:number,silder_path:boolean) => {
    player_no_progress_jump.value = false;
    player_silder_currentTime_added_value.value = 0;
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
  }
  const update_dragend_slider_singleValue = () => {
    if(slider_singleValue.value >= 99.5 || slider_singleValue.value == 0){
      is_play_ended.value = true;
      player_range_duration_handleclick()
    }
    player_range_duration_isDragging = false;
  };
  
  ////// open playList
  const Set_Playlist_Show = () => {
    emits('Playlist_Show',true);
  }
  ////// open sound effects
  const Set_Player_Show_Sound_effects= () => {
    if(props.Player_Show_Sound_effects === false)
      emits('Player_Show_Sound_effects',true);
    else
      emits('Player_Show_Sound_effects',false);
  }
  ////// open sound speedPlayer_Show_Sound_more
  const Set_Player_Show_Sound_speed= () => {
    if(props.Player_Show_Sound_speed === false)
      emits('Player_Show_Sound_speed',true);
    else
      emits('Player_Show_Sound_speed',false);
  }
  ////// open sound more info
  const Set_Player_Show_Sound_more= () => {
    if(props.Player_Show_Sound_more === false)
      emits('Player_Show_Sound_more',true);
    else
      emits('Player_Show_Sound_more',false);
  }

  ////// auto collapse player_configs bar
  const handleRefusetohide = () => {
    emits('player_collapsed_action_bar_of_Immersion_model', false);
  };
  const handleMouseMove = () => {
    if(props.player_show === true){
      emits('player_collapsed_action_bar_of_Immersion_model', true);
      drawer_order_show.value = false;
      drawer_volume_show.value = false;
    }
  };

  ////// changed_data write to sqlite
  import { Set_MediaInfo_To_LocalSqlite } from '@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite'
  let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
  const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Favorite(id,favorite)
    emits('this_audio_song_favorite',!favorite)
  }
  const handleItemClick_Rating = (id: any,rating: number) => {
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_Rating(id,rating)
    emits('this_audio_song_rating',rating)
  }

  /////// emits audio_info of songlist_view_list
  const handleItemClick_title = (title:string) => {
    emits('page_songlists_keyword',title)

    player_show_hight_animation_value.value = 670;
    emits('player_show_height',player_show_hight_animation_value.value);
    if(player_show_hight_animation_value.value === 0)
      svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
    else
      svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
    back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
  }
  const handleItemClick_artist = (artist:string) => {
    emits('page_songlists_keyword',artist+'accurate_search'+'__artist__')
    
    player_show_hight_animation_value.value = 670;
    emits('player_show_height',player_show_hight_animation_value.value);
    if(player_show_hight_animation_value.value === 0)
      svg_shrink_up_arrow.value = 'shrink_down_arrow.svg';
    else
      svg_shrink_up_arrow.value = 'shrink_up_arrow.svg';
    back_ChevronDouble.value = '../../resources/svg/'+svg_shrink_up_arrow.value;
  }
  const handleItemClick_album = (album:string) => {
    emits('page_songlists_keyword',album+'accurate_search'+'__album__')
    
    player_show_hight_animation_value.value = 670;
    emits('player_show_height',player_show_hight_animation_value.value);
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
    unwatch_player_silder_currentTime_added_value()
    unwatch_this_audio_restart_play()
    unwatch_this_audio_buffer_file()
    unwatch_play_go_index_time()
    unwatch_slider_volume_value()
  });
</script>

<template>
  <n-space class="this_Bar_Music_Player"
    style="transition: margin 0.4s;"
    :style="{ marginBottom: player_collapsed_action_bar_of_Immersion_model ? '-80px' : '0px' }"
    @mousemove="handleRefusetohide" @mouseleave="handleMouseMove" @mouseover="handleRefusetohide">
    <div class="layout_distribution_3"
      style="transition: margin 0.4s;"
      :style="{ 
        marginLeft: player_show ? '0px' : (collapsed ? '72px' : '167px'),
        width: player_show ? '100vw' : (collapsed ? 'calc(100vw - 72px)' : 'calc(100vw - 167px)'),
      }">
      <div class="gird_Left">
        <div class="button_open_player_view">
          <img class="back_svg"
              :src="back_ChevronDouble"
              :style="{ display: back_display }"
              @click="click_back_svg" @mouseover="hover_back_img" @mouseout="leave_back_svg" alt=""/>
              
          <img class="back_img" 
              :src="getAssetImage(props.this_audio_file_medium_image_url)"
              @error="handleImageError"
              :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
              style="objectFit: cover; objectPosition: center;"
              @click="click_back_svg"
              @mouseover="hover_back_img" @mouseout="leave_back_svg" alt=""/>
        </div>
        <div class="bar_left_text_song_info">
          <n-space>
            <n-ellipsis>
              <span id="bar_song_name" @click="handleItemClick_title(props.this_audio_song_name)">{{ props.this_audio_song_name + '&nbsp-&nbsp' }}</span>
              <template v-for="artist in props.this_audio_singer_name.split(/[\/|｜]/)">
                <span id="bar_singer_name_part" @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
              </template>
            </n-ellipsis>
          </n-space>
          <n-space>
            <n-ellipsis>
              <span id="bar_album_name" @click="handleItemClick_album(props.this_audio_album_id)">{{ props.this_audio_album_name }}</span>
            </n-ellipsis>
          </n-space>
        </div>
      </div>
      <div class="gird_Middle">
        <!-- grid_Middle_button_area -->
        <n-space class="grid_Middle_button_area" justify="center">
          <n-button quaternary round size="small" @click="backpanel_order_click">
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
        <!-- grid_Middle_slider_area -->
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
        <!-- grid_Middle_drwaer_area -->
        <n-config-provider :theme="null">
          <div id="backpanel_order">
            
          </div>
          <n-drawer
            v-model:show="drawer_order_show"      
            placement="bottom"
            to="#backpanel_order"
            :height="150"
            show-mask="transparent"
            style="border-radius: 10px;">
            <n-drawer-content>
              <n-space vertical style="height: 100px;">
                <n-button quaternary @click="play_order = 'playback-1'" style="margin-left: -18px;margin-top: -8px;">
                  <template #icon>
                    <n-icon>
                      <ArrowAutofitDown24Regular/>
                    </n-icon>
                  </template>
                  顺序播放
                </n-button>
                <n-button quaternary @click="play_order = 'playback-2'" style="margin-left: -18px;margin-top: -8px;">
                  <template #icon>
                    <n-icon>
                      <ArrowRepeatAll16Regular/>
                    </n-icon>
                  </template>
                  列表循环
                </n-button>
                <n-button quaternary @click="play_order = 'playback-3'" style="margin-left: -18px;margin-top: -8px;">
                  <template #icon>
                    <n-icon>
                      <RepeatOneRound/>
                    </n-icon>
                  </template>
                  单曲循环
                </n-button>
                <n-button quaternary @click="play_order = 'playback-4'" style="margin-left: -18px;margin-top: -8px;">
                  <template #icon>
                    <n-icon :size="12">
                      <Random />
                    </n-icon>
                  </template>
                  随机播放
                </n-button>
              </n-space>
            </n-drawer-content>
          </n-drawer>
        </n-config-provider>
        <n-config-provider :theme="null">
          <div id="backpanel_voice">
            
          </div>
          <n-drawer
            v-model:show="drawer_volume_show"      
            placement="bottom"
            :width="77"
            :height="226"
            to="#backpanel_voice"
            show-mask="transparent"
            style="border-radius: 10px;"
          >
            <n-drawer-content>
              <n-space vertical justify="center" align="center" >
                <n-slider 
                  style="
                    width: 18px;height: 158px;
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
          <n-badge :value="props.playlist_Files_temporary.length" show-zero :max="9999" :offset="[-7, 3]">
            <n-button strong secondary class="gird_Right_current_playlist_button_area_of_button" @click="Set_Playlist_Show">
              <template #icon>
                 <n-icon :size="42"><QueueMusicRound/></n-icon>
              </template>
            </n-button>
          </n-badge>
        </n-space>   
        <div class="gird_Right_button_area">
          <n-space justify="space-between">
            <n-rate clearable size="small" v-model:value="props.this_audio_song_rating" @update:value="(value: number) => handleItemClick_Rating(props.this_audio_song_id, value)"/>
            <n-button size="tiny" text @click="handleItemClick_Favorite(props.this_audio_song_id,props.this_audio_song_favorite);">
              <template #icon>
                <n-icon v-if="props.this_audio_song_favorite" :size="22" color="red"><Heart28Filled/></n-icon>
                <n-icon v-else :size="22"><Heart24Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_more">
              <template #icon>
                <n-icon :size="22"><MoreCircle32Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_speed">
              <template #icon>
                <n-icon :size="22"><TopSpeed20Regular/></n-icon>
              </template>
            </n-button>
            <n-button size="tiny" text @click="Set_Player_Show_Sound_effects">
              <template #icon>
                <n-icon :size="22"><DeviceEq24Filled/></n-icon>
              </template>
            </n-button>
          </n-space>
        </div>
      </div>
    </div>
<!--    <lottie-player-->
<!--      ref="animationInstance"-->
<!--      loop-->
<!--      mode="normal"-->
<!--      :src="animationInstance_json"-->
<!--      style="-->
<!--        position: absolute;bottom:14px;right:36px;-->
<!--        width:50px;height:50px;-->
<!--      ">-->
<!--    </lottie-player>-->
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
  width: 120px;
  border-radius: 10px;
}
.gird_Middle #backpanel_voice{
  position: fixed;
  bottom: 80px;
  margin-left: 280px;
  width: 77px;
  height: 100px;
  border-radius: 10px;
}

.gird_Right {
  width: 300px;
  height: 80px;
  margin-right: 12px;
  
  cursor: default;
  user-select: none;
}
.gird_Right .gird_Right_button_area{
  width: 105px;
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
</style>