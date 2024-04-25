<script setup lang="ts">
  import { defineEmits, ref, watch, watchEffect, onMounted } from 'vue';
  const emits = defineEmits([
    'player_show_click','play_go_index_time','view_collapsed_player_bar',
    'collapsed_slider','player_album_size','player_album_radius','player_album_info_left',
    'player_lyric_fontSize','player_lyric_fontWeight','player_lyric_color','player_album_cover_rotate',
    'player_theme_lyricItem_Styles_Selected'
  ]);

  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_refresh',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name',
    'this_audio_lyrics_string','this_audio_lyrics_info_line','this_audio_lyrics_info_time',
    'player','currentTime_added_value',
    'view_music_player_show_complete','this_audio_lyrics_info_line_num',
    'view_collapsed_player_bar',
    'collapsed_slider','player_album_size','player_album_radius','player_album_info_left',
    'player_lyric_fontSize','player_lyric_fontWeight','player_lyric_color','player_album_cover_rotate',
    'player_theme_lyricItem_Styles_Selected'
  ]);
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
  ////// lyircs load
  let unwatch = watch(() => props.this_audio_lyrics_string, (value) => {
    load_lyrics()
  });
  onMounted(() => {
    load_lyrics()// v-if为false，则 watch(() => props.this_audio_lyrics_string 无法检测
  });
  function load_lyrics() {
    if(props.this_audio_lyrics_string.length > 0) {
      begin_lyrics_animation()
      
      try{
        setTimeout(() => {
          handleLeave()
        }, 200);
      }catch(e){
        console.log(e)
      }
    }
  }
  function begin_lyrics_animation() {
    clearInterval(lyrics_animation);
    lyrics_animation = setInterval(() => {
      for (let i = 0; i < props.this_audio_lyrics_info_time.length; i++) {
        if(props.player !== null && props.player.getCurrentTime() !== undefined && props.player.getCurrentTime() !== null){
          // let currentTime = (Math.floor(props.currentTime_added_value) + props.player.getCurrentTime())*1000;
          let currentTime = props.player.getCurrentTime()*1000;
          if(currentTime <= props.this_audio_lyrics_info_time[0]){  
            if(lyrics_list_whell.value === false){
              scrollToItem(props.this_audio_lyrics_info_line_num);
            }
            break;
          }else if(currentTime >= props.this_audio_lyrics_info_time[i]){
            if(i === props.this_audio_lyrics_info_time.length - 1){
              if(lyrics_list_whell.value === false){
                scrollToItem(i + props.this_audio_lyrics_info_line_num);
              }
              break;
            }else if(currentTime < props.this_audio_lyrics_info_time[i+1]){
              if(lyrics_list_whell.value === false){
                scrollToItem(i + props.this_audio_lyrics_info_line_num);
              }
              break;
            }
          }
        }
      }
    }, 100);
  }
  let lyrics_animation: string | number | NodeJS.Timeout | undefined;
  const handleItemDbClick = (index: any) => {
    if(index < props.this_audio_lyrics_info_line_num) return;
    if(index > props.this_audio_lyrics_info_line.length - props.this_audio_lyrics_info_line_num - 1) return;
    const time = props.this_audio_lyrics_info_time[index - props.this_audio_lyrics_info_line_num];
    if(time >= props.player.getDuration()*1000) return;
    if(time < 0) return;
    emits('play_go_index_time', time);
  };
  const scrollbar = ref(null as any);
  const perviousIndex = ref(0);
  const scrollToItem = (index: number) => {
    if (!scrollbar.value) {
      return;
    }
    if(lyrics_list_whell.value){
      return;
    }

    const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
    itemElements_active[index].style.fontSize = player_theme_lyricItem_0_bind_style.value.normalStyle.fontSize;
    itemElements_active[index].style.fontWeight = player_theme_lyricItem_0_bind_style.value.normalStyle.fontWeight;

    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    itemElements[index].style.color = player_theme_lyricItem_0_bind_style.value.hoverStyle.colorHover;
    itemElements[index].style.filter = 'blur(0px)';
    itemElements[index].style.textShadow = '0 0 1px White';
    itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
    if(collapsed_slider.value === false){
      itemElements[index].style.transform = 'scale(1.1) translateY(0px)';
      itemElements[index].style.transformOrigin = 'left center';
    }else{
      itemElements[index].style.transform = 'scale(1.1)  translateX(0px)';
      itemElements[index].style.transformOrigin = 'center';
    }
    // BUG: if space-line Not fully covered at the bottom, exceeding the bottom portion , The entire page will be moved up，because block: 'center' used this page
    itemElements[index].scrollIntoView({ block: 'center', behavior: perviousIndex.value === index - 1 ? 'smooth' : 'instant' });
    
    let color_hidden = player_lyric_color.value.slice(0, -2);
    let blurValue = 0.07;
    for (let i = index - 16; i <= index + 16; i++) {
      if (i < index) {
        const colorValue = Math.max(90 - (index - i) * 20, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.filter = `blur(${blurValue}px)`;
        blurValue += 0.07;

        itemElements[i].style.transform = 'scale(1)';
        itemElements[i].style.textShadow = '0 0 0px transparent';
      } else if (i != index) {
        const colorValue = Math.max(90 - (i - index) * 20, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.filter = `blur(${blurValue}px)`;
        blurValue += 0.07;

        itemElements[i].style.transform = 'scale(1)';
        itemElements[i].style.textShadow = '0 0 0px transparent';
      }
    }
    perviousIndex.value = index;
  };
  const lyrics_list_whell = ref(false);
  const handleWheel = (event: any) => {
    lyrics_list_whell.value = true;
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    for (let i = 0; i < itemElements.length; i++) {
      itemElements[i].style.color = player_theme_lyricItem_0_bind_style.value.normalStyle.color;
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.filter = 'blur(0px)';
    }
  };
  const handleLeave = () => {
    lyrics_list_whell.value = false;
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    let color_hidden = player_lyric_color.value.slice(0, -2);
    let blurValue = 0.05;
    for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
      if (i < perviousIndex.value) {
        const colorValue = Math.max(90 - (perviousIndex.value - i) * 20, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.filter = `blur(${blurValue}px)`;
        blurValue += 0.05;
      } else {
        const colorValue = Math.max(90 - (i - perviousIndex.value) * 20, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.filter = `blur(${blurValue}px)`;
        blurValue += 0.05;
      }
    }
  };
  ////// player theme seting
  const collapsed_slider = ref(false);// collapsed_slider.value = player_theme_lyricItem_0_bind_style.value.normalStyle.collapsed_slider;
  const player_album_size = ref('54vh')
  const player_album_radius = ref('10px')
  const player_album_info_left = ref(true)
  const player_lyric_fontSize = ref('22px')
  const player_lyric_fontWeight = ref('800')
  const player_lyric_color = ref('#FAFAFB60')
  const player_album_cover_rotate = ref(false)
  onMounted(() => {
    player_album_size.value = props.player_album_size;
    player_album_cover_rotate.value = props.player_album_cover_rotate;
    player_album_radius.value = props.player_album_radius;
    player_album_info_left.value = props.player_album_info_left;
    player_lyric_fontSize.value = props.player_lyric_fontSize;
    player_lyric_fontWeight.value = props.player_lyric_fontWeight;
    player_lyric_color.value = props.player_lyric_color;
    collapsed_slider.value = props.collapsed_slider;
    player_theme_lyricItem_Styles_Selected.value = props.player_theme_lyricItem_Styles_Selected;
  });
  type PlayerThemeStyle = {
    image_url: any;

    size:any;
    cover_rotate:any;
    radius: any;
    textAlign: any;

    color:any;
    fontSize: any;
    fontWeight: any;
    maxHeight: any;
    collapsed_slider: any;
  };
  type PlayerThemeHoverStyle = {
    colorHover:any;
  };
  type PlayerTheme_LyricItem = {
    id: any;
    name: any;
    normalStyle:PlayerThemeStyle;
    hoverStyle:PlayerThemeHoverStyle;
  };
  // play model 1 ：方形封面
  const player_theme_lyricItem_1 = ref<PlayerTheme_LyricItem>(
    { 
      id: 0,
      name: '方形封面',
      normalStyle: {
        image_url: '../../resources/player_theme_1.png',

        size: '54vh',
        cover_rotate: false,
        radius: '10px',
        textAlign: true,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: false,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  // play model 2 ：旋转封面
  const player_theme_lyricItem_2 = ref<PlayerTheme_LyricItem>(
    { 
      id: 1,
      name: '旋转封面',
      normalStyle: {
        image_url: '../../resources/player_theme_2.png',

        size: '54vh',
        cover_rotate: true,
        radius: '27vh',
        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: false,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  // play model 3 ：炫胶唱片
  const player_theme_lyricItem_3 = ref<PlayerTheme_LyricItem>(
    { 
      id: 2,
      name: '炫胶唱片',
      normalStyle: {
        image_url: '../../resources/player_theme_1.png',

        size: '54vh',
        cover_rotate: false,
        radius: '27vh',
        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: false,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  // play model 4 ：聚光唱片
  const player_theme_lyricItem_4 = ref<PlayerTheme_LyricItem>(
    { 
      id: 3,
      name: '聚光唱片',
      normalStyle: {
        image_url: '../../resources/player_theme_1.png',

        size: '54vh',
        cover_rotate: false,
        radius: '27vh',
        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: false,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  // play model 5 ：歌手写真
  const player_theme_lyricItem_5 = ref<PlayerTheme_LyricItem>(
    { 
      id: 4,
      name: '歌手写真',
      normalStyle: {
        image_url: '../../resources/player_theme_3.png',

        size: '54vh',
        cover_rotate: false,
        radius: '10px',
        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  // play model 6 ：皮肤底图
  const player_theme_lyricItem_6 = ref<PlayerTheme_LyricItem>(
    { 
      id: 5,
      name: '皮肤底图',
      normalStyle: {
        image_url: '../../resources/player_theme_3.png',

        size: '54vh',
        cover_rotate: false,
        radius: '10px',
        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        maxHeight: '100vh',
        collapsed_slider: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_lyricItem_Styles = ref<PlayerTheme_LyricItem[]>(
    [
      player_theme_lyricItem_1.value,
      player_theme_lyricItem_2.value,
      player_theme_lyricItem_3.value,
      player_theme_lyricItem_4.value,
      player_theme_lyricItem_5.value,
      player_theme_lyricItem_6.value,
    ]
  );
  // player bind style
  const player_theme_lyricItem_Styles_Selected = ref<number>(0)
  const player_theme_lyricItem_0_bind_style = ref<PlayerTheme_LyricItem>(player_theme_lyricItem_Styles.value[player_theme_lyricItem_Styles_Selected.value]);
  const player_theme_set_theme = (index:number) => {
    if(index < 0 || index >= player_theme_lyricItem_Styles.value.length){
      return;
    }
    player_theme_lyricItem_0_bind_style.value = player_theme_lyricItem_Styles.value[index];
    player_theme_lyricItem_Styles_Selected.value = index;
    emits('player_theme_lyricItem_Styles_Selected' ,index);
    // set theme
    player_album_size.value = player_theme_lyricItem_0_bind_style.value.normalStyle.size;
    player_album_cover_rotate.value = player_theme_lyricItem_0_bind_style.value.normalStyle.cover_rotate;
    player_album_radius.value = player_theme_lyricItem_0_bind_style.value.normalStyle.radius;
    player_album_info_left.value = player_theme_lyricItem_0_bind_style.value.normalStyle.textAlign;
    player_lyric_fontSize.value = player_theme_lyricItem_0_bind_style.value.normalStyle.fontSize;
    player_lyric_fontWeight.value = player_theme_lyricItem_0_bind_style.value.normalStyle.fontWeight;
    player_lyric_color.value = player_theme_lyricItem_0_bind_style.value.normalStyle.color;
    collapsed_slider.value = player_theme_lyricItem_0_bind_style.value.normalStyle.collapsed_slider;
    // emits theme
    emits('player_album_size' ,player_theme_lyricItem_0_bind_style.value.normalStyle.size);
    emits('player_album_cover_rotate' ,player_theme_lyricItem_0_bind_style.value.normalStyle.cover_rotate);
    emits('player_album_radius' ,player_theme_lyricItem_0_bind_style.value.normalStyle.radius);
    emits('player_album_info_left' ,player_theme_lyricItem_0_bind_style.value.normalStyle.textAlign);
    emits('player_lyric_fontSize' ,player_theme_lyricItem_0_bind_style.value.normalStyle.fontSize);
    emits('player_lyric_fontWeight' ,player_theme_lyricItem_0_bind_style.value.normalStyle.fontWeight);
    emits('player_lyric_color' ,player_theme_lyricItem_0_bind_style.value.normalStyle.color);
    emits('collapsed_slider' ,player_theme_lyricItem_0_bind_style.value.normalStyle.collapsed_slider);
    // set lyric auto setting
    // 
  };
  const isVisible_Player_theme = ref(false);
  const get_isVisible_Player_theme = () => {
    isVisible_Player_theme.value = !isVisible_Player_theme.value;
  }
  // player lyric_panel height and animation
  const player_lyric_panel_checked_double_line = ref<Boolean>(false)
  enum LyricAnimation {linebyLine,linebyWord,linebyJump}
  const player_lyric_panel_checked_animation = ref<LyricAnimation>(LyricAnimation.linebyLine)
  // player page_ui
  const isVisible_Player_page_ui = ref(false);
  const get_isVisible_Player_page_ui = () => {
    isVisible_Player_page_ui.value = !isVisible_Player_page_ui.value;
  }
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
  const player_lyric_panel_fontsize = ref(24)
  ////// player info model
  const checkStrategy = ref<'player' | 'related'>('player')
  ////// System BrowserWindow Set
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  //
  function close_media_player() {
    if(props.view_music_player_show_complete)
      emits('player_show_click', true);
  }
  ////// auto collapse player bar
  let timer_auto_hidden: string | number | NodeJS.Timeout | undefined;
  const handleMouseMove = () => {
    emits('view_collapsed_player_bar', false);
    clearInterval(timer_auto_hidden);
    timer_auto_hidden = setInterval(() => {
      emits('view_collapsed_player_bar', true);
    }, 3000);
  };
  const unwatch_view_collapsed_player_bar = watchEffect(() => {
    if (props.view_collapsed_player_bar === false) {
      clearInterval(timer_auto_hidden);
    }
  });
  //
  import { onBeforeUnmount } from 'vue';
  onBeforeUnmount(() => {
    clearInterval(lyrics_animation);
    clearInterval(timer_auto_hidden);
    unwatch();
    unwatch_view_collapsed_player_bar();
    emits('view_collapsed_player_bar', false);
  });
  import { darkTheme,lightTheme } from 'naive-ui'
  import {
    Home28Regular,
    Flag16Regular,
    SlideMicrophone32Regular,
    DocumentHeart20Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    PeopleCommunity16Regular,
    ArrowMinimize16Regular,Maximize16Regular,ColorBackground20Regular,
    ChevronDown12Filled,Settings24Regular
  } from '@vicons/fluent'
  import {
    AlbumFilled,
    MusicNoteRound,
    LibraryMusicOutlined,
    MotionPhotosAutoOutlined
  } from '@vicons/material'
  import {
    UserAvatarFilledAlt,
    Hearing,
    Close,Settings,Menu as MenuIcon,
  } from '@vicons/carbon'
  import type { VirtualListInst } from 'naive-ui';
</script>

<template>
  <div style="overflow: hidden;" @mousemove="handleMouseMove" @click="handleMouseMove">
    <div>
      <img
        id="player_bg_zindex_0"
        style="
          position: absolute;top: -20vw;left: -10vw;width: 120vw;height: 120vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(60px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError">
      <!-- <img
        id="player_bg_zindex_1"
        style="
          position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
          filter: blur(0px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError"> -->
    </div>
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of Player_theme -->
      <n-drawer 
        v-model:show="isVisible_Player_theme" 
        :width="384" 
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1); 
          backdrop-filter: blur(10px); 
          margin-top: calc(50vh - 290px);height: 580px;
          ">
        <n-drawer-content v-if="isVisible_Player_theme">
          <template #default>
            <n-radio-group 
              v-model:value="player_theme_lyricItem_Styles_Selected" 
              :on-update:value="player_theme_set_theme"
              name="radiogroup"
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                align-items: center; 
                grid-gap: 0px;
                margin-left: 9px;
                margin-top: 12px;"
              >
              <n-radio
                v-for="item in player_theme_lyricItem_Styles" 
                :key="item.id" v-model:value="item.id"
                style="height: 100%;z-index: 9;">
                <n-space vertical justify="center" style="position: relative;left: -27px;z-index: -1;">
                  <img 
                    :src="item.normalStyle.image_url" 
                    style="width: auto;height: 100px;object-fit: cover;
                    border-radius: 8px;border-radius: 8px;border: 1.5px solid #FFFFFF20;">
                  <span style="font-size: 16px;position: relative;top: -10px;left: 6px;">
                    {{ item.name }}
                  </span>
                </n-space>
              </n-radio>
            </n-radio-group>
            <n-space style="margin-left: 12px;margin-top: 8px;">
              <span style="font-size:16px;">歌词行数</span>
              <n-space style="margin-top: 2px;">
                <n-radio
                  :checked="!player_lyric_panel_checked_double_line" value="多行"
                  @click="player_lyric_panel_checked_double_line = !player_lyric_panel_checked_double_line;">
                  多行
                </n-radio>
                <n-radio
                  :checked="player_lyric_panel_checked_double_line" value="双行"
                  @click="player_lyric_panel_checked_double_line = !player_lyric_panel_checked_double_line;">
                  双行
                </n-radio>
              </n-space> 
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">歌词动效</span>
              <n-space style="width: 260px;margin-left: 76px;margin-top: -32px;">
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyLine" value="逐行精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyLine">
                  逐行精准
                </n-radio>
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyWord" value="逐字精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyWord">
                  逐字精准
                </n-radio>
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyJump" value="跳跃精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyJump;">
                  跳跃精准
                </n-radio>
              </n-space>
            </n-space>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- right drwaer of Player_UI_Set -->
      <n-drawer 
        v-model:show="isVisible_Player_page_ui" 
        :width="404" 
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1); 
          backdrop-filter: blur(10px); 
          margin-top: calc(50vh - 232px);height: 464px;
        ">
        <n-drawer-content v-if="isVisible_Player_page_ui">
          <template #default>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">字体设置</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-select
                  v-model:value="player_lyric_panel_fontfamily_options_selected"
                  :options="player_lyric_panel_fontfamily_options"
                  placeholder="微软雅黑"
                  :reset-menu-on-options-change="false"
                  style="width: 218px;margin-top: -4px;"
                />
              </n-space> 
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">歌词语言</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-select
                  v-model:value="player_lyric_panel_fontfamily_options_selected"
                  :options="player_lyric_panel_fontfamily_options"
                  placeholder="简体中文"
                  :reset-menu-on-options-change="false"
                  style="width: 218px;margin-top: -4px;"
                />
              </n-space> 
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">字号设置</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 120px;margin-top: -4px;"
                />
                <n-select
                  v-model:value="player_lyric_panel_fontfamily_options_selected"
                  :options="player_lyric_panel_fontfamily_options"
                  placeholder="常规"
                  :reset-menu-on-options-change="false"
                  style="width: 86px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">歌词行距</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 120px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">歌词快慢</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 120px;margin-top: -4px;"
                />
                <n-button style="margin-top: -4px;">
                  重置
                </n-button>
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 24px;">
              <span style="font-size:16px;">歌词颜色</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-color-picker style="width: 190px;margin-top: -4px;"/>
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">专辑底图模糊度</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 120px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">皮肤底图模糊度</span>
              <n-space style="margin-left: 8px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 120px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
    <!-- body -->
    <n-space vertical :size="12" style="z-index: 99;overflow: hidden;">
      <n-space vertical>
        <n-flex 
          justify="space-between" 
          style="transition: margin 0.4s;"
          :style="{ marginTop: view_collapsed_player_bar ? '-70px' : '0px' }">
          <n-flex style="height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-left:30px;">
              <n-button quaternary size="medium" 
                style="margin-right:4px" @click="close_media_player">
                <template #icon>
                  <n-icon size="30" :depth="3"><ChevronDown12Filled/></n-icon>
                </template>
              </n-button>
            </div>
          </n-flex>
          <div 
            v-if="false"
            style="
              -webkit-app-region: no-drag;margin-top: 35px;margin-left:calc(50vw - 306px);
            ">
            <n-radio-group size="small" v-model:value="checkStrategy">
              <n-radio-button size="small" value="player">
                播放
              </n-radio-button>
              <n-radio-button size="small" value="related">
                相关
              </n-radio-button>
            </n-radio-group>
          </div>
          <n-flex justify="end" style="height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 30px;">
              <n-button quaternary style="margin-right:2px" @click="get_isVisible_Player_theme">
                <template #icon>
                  <n-icon :depth="3"><ChevronDown12Filled /></n-icon>
                </template>
                <span style="font-weight: 500;">背景模式</span>
              </n-button>
              <n-button quaternary style="margin-right:10px" @click="get_isVisible_Player_page_ui">
                <template #icon>
                  <n-icon :depth="3"><Settings24Regular /></n-icon>
                </template>
                <span style="font-weight: 500;">界面设置</span>
              </n-button>
              <n-button quaternary circle size="medium" 
                style="margin-right:4px" @click="minimize">
                <template #icon>
                  <n-icon size="18" :depth="3"><ArrowMinimize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" 
                style="margin-right:4px" @click="maximize">
                <template #icon>
                  <n-icon size="24" :depth="3"><Maximize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" 
                style="margin-right:30px" @click="closeWindow">
                <template #icon>
                  <n-icon size="28" :depth="3"><Close/></n-icon>
                </template>
              </n-button>
            </div>
          </n-flex>
        </n-flex>
        <n-config-provider :theme="null">
          <n-flex 
            justify="center" 
            style="transition: margin 0.4s;"
            :style="{ marginTop: view_collapsed_player_bar ? '70px' : '0px' }">
            <n-layout has-sider style="background-color: transparent;">
              <!-- Album 
                show-trigger="bar" calc(50vw + 27vh + 8vw) :show-collapsed-content="false"-->
              <n-layout-sider 
                :collapsed="collapsed_slider" @collapse="emits('collapsed_slider', true)" @expand="emits('collapsed_slider', false)"
                :show-collapsed-content="false" collapse-mode="transform"
                position="static"
                collapsed-width="30vw" width="53vw"
                style="background-color: transparent;">
                <n-space vertical align="end" style="margin-right:6vw;">
                  <n-space vertical>
                    <img
                      :style="{
                        width: player_album_size, 
                        height: player_album_size, 
                        borderRadius: player_album_radius
                      }"
                      style="
                        margin-top: calc(28vh - 162px);
                        border: 1.5px solid #FFFFFF20;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 16px 16px 16px rgba(0, 0, 0, 0.20), 0px 0px 16px rgba(0, 0, 0, 0.20);
                      "
                      :src="getAssetImage(props.this_audio_file_medium_image_url)"
                      @error="handleImageError">
                    <div
                      :style="{width: player_album_size,textAlign: player_album_info_left ? 'left' : 'center',}"
                      style="
                        margin-left: 2px;
                        color: #E7E5E5;
                        font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                      ">
                      {{ props.this_audio_song_name }}
                    </div>
                    <div
                      :style="{width: player_album_size,textAlign: player_album_info_left ? 'left' : 'center',}"
                      style="
                        margin-left: 2px;margin-top: -10px;
                        color: #989292;
                        font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                      ">
                      {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
                    </div>
                  </n-space>
                </n-space>
              </n-layout-sider>
              <!-- Lyic -->
              <n-layout-content
                style="background-color: transparent;margin-left:2vw;">
                <div 
                  style="
                    width: 40vw;height: calc(100vh - 200px);
                    border-radius: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  ">
                  <n-list
                    clickable :show-divider="false"
                    ref="scrollbar"
                    @wheel="handleWheel"
                    @mouseleave="handleLeave"
                    style="
                      width: calc(40vw);max-height: calc(66vh);
                      overflow: auto;
                      background-color: #00000000;
                    ">
                    <template #default>
                      <n-list-item 
                        class="lyrics_info" 
                        :style="{
                          textAlign: collapsed_slider ? 'center' : 'left',
                        }"
                        v-for="(item, index) in props.this_audio_lyrics_info_line" 
                        @click="handleItemDbClick(index)">
                        <div class="lyrics_text_active">
                          {{ item }}
                        </div>
                      </n-list-item>
                    </template>
                  </n-list>
                </div>
              </n-layout-content>
            </n-layout>
          </n-flex>
        </n-config-provider>
        <n-flex justify="end">

        </n-flex>
      </n-space>
    </n-space>
  </div>
</template>

<style scoped>
/* filter: blur(10px) grayscale(100%); */
#player_bg_zindex_0 {
  z-index: -2;
}
#player_bg_zindex_1 {
  z-index: -1;
}
.lyrics_info {
  /* color: v-bind(player_lyric_color); */
  color: transparent;
  width: calc(40vw);
  margin-top: 6px;min-height: 50px;
  cursor: pointer;
  border-radius: 10px;
  line-height: 1.2;
  transition: color 0.5s, background-color 0.5s;
  filter: blur(0.07px);
}
.lyrics_info:hover {
  background-color: #FFFFFF16;
}
.lyrics_text_active {
  font-size: v-bind(player_lyric_fontSize);
  font-weight: v-bind(player_lyric_fontWeight);
  max-width: calc(36vw);
  padding-left: 20px;padding-top: 0px;padding-bottom: 4px;
}

::-webkit-scrollbar {
  display: none;
}
</style>