<script setup lang="ts">
  ////// this_view resource
  import {
    ArrowMinimize16Regular,Maximize16Regular,
    ChevronDown12Filled,Settings24Regular
  } from '@vicons/fluent'
  import {
    MotionPhotosAutoOutlined
  } from '@vicons/material'
  import {
    Close,
  } from '@vicons/carbon'
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

  ////// navie ui components
  // app theme
  import { darkTheme } from 'naive-ui'
  // vue3 function
  import { defineEmits, ref, watch, watchEffect, onMounted } from 'vue';
  import { onBeforeUnmount } from 'vue';

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t, d, n } = useI18n({
    inheritLocale: true
  })
  const computed_i18n_Label_ViewSetConfig_Cover_1 = computed(() => t('nsmusics.view_player.view_seting.coverSquare_1'));
  const computed_i18n_Label_ViewSetConfig_Cover_2 = computed(() => t('nsmusics.view_player.view_seting.coverRotate_2'));
  const computed_i18n_Label_ViewSetConfig_Cover_3 = computed(() => t('nsmusics.view_player.view_seting.coverBeaut_3'));
  const computed_i18n_Label_ViewSetConfig_Cover_4 = computed(() => t('nsmusics.view_player.view_seting.coverBase_4'));

  // audio_class & player_bar
  import { Player_UI_Theme_State } from '@/features/player/Player_UI_Theme_State'

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
  function close_media_player() {
    if(props.player_show_complete)
      emits('player_show_click', true);
  }

  ////// passed as argument
  const emits = defineEmits([
    'player_show_click','player_go_lyricline_index_of_audio_play_progress','player_collapsed_action_bar_of_Immersion_model',
    'player_UI_Theme_State'
  ]);
  const props = defineProps([
    'this_audio_file_path','playlist_Files_temporary',
    'this_audio_file_medium_image_url','this_audio_restart_play',
    'this_audio_singer_name','this_audio_song_name','this_audio_album_name',
    'this_audio_lyrics_string','this_audio_lyrics_info_line','this_audio_lyrics_info_time',
    'player','this_audio_is_playing','player_silder_currentTime_added_value',
    'player_show_complete','this_audio_lyrics_info_line_num',
    'player_collapsed_action_bar_of_Immersion_model',
    'player_UI_Theme_State'
  ]);

  ////// lyircs load
  let unwatch = watch(() => props.this_audio_lyrics_string, (value) => {load_lyrics()});
  onMounted(() => {load_lyrics()});
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
          // let currentTime = (Math.floor(props.player_silder_currentTime_added_value) + props.player.getCurrentTime())*1000;
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
    emits('player_go_lyricline_index_of_audio_play_progress', time);
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
    itemElements_active[index].style.fontSize = player_theme_0_bind_style.value.normalStyle.fontSize;
    itemElements_active[index].style.fontWeight = player_theme_0_bind_style.value.normalStyle.fontWeight;

    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    itemElements[index].style.color = player_theme_0_bind_style.value.hoverStyle.colorHover;
    itemElements[index].style.filter = 'blur(0px)';
    itemElements[index].style.textShadow = '0 0 1px White';
    itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
    if(player_collapsed_album.value === false){
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
      itemElements[i].style.color = player_theme_0_bind_style.value.normalStyle.color;
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

  ////// player theme BasicInfo
  let player_ui_theme = new Player_UI_Theme_State();
  const player_collapsed_album = ref(false);
  const player_collapsed_skin = ref(true)
  const player_lyric_fontSize = ref('22px')
  const player_lyric_fontWeight = ref('800')
  const player_lyric_color = ref('#FAFAFB60')
  const player_background_model_num = ref(0)
  type PlayerTheme_Style = {
    image_url: any;

    textAlign: any;

    color:any;
    fontSize: any;
    fontWeight: any;
    player_collapsed_album: any;
    player_collapsed_skin: any;
  };
  type PlayerTheme_HoverStyle = {
    colorHover:any;
  };
  type PlayerTheme_LyricItem = {
    id: any;
    name: any;
    normalStyle:PlayerTheme_Style;
    hoverStyle:PlayerTheme_HoverStyle;
  };
  const player_theme_1 = ref<PlayerTheme_LyricItem>(
    { 
      id: 0,
      name: computed_i18n_Label_ViewSetConfig_Cover_1.value,
      normalStyle: {
        image_url: '../../resources/img/player_theme_1.png',

        textAlign: true,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        player_collapsed_album: false,
        player_collapsed_skin: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_2 = ref<PlayerTheme_LyricItem>(
    { 
      id: 1,
      name: computed_i18n_Label_ViewSetConfig_Cover_2.value,
      normalStyle: {
        image_url: '../../resources/img/player_theme_2.png',

        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        player_collapsed_album: false,
        player_collapsed_skin: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_3 = ref<PlayerTheme_LyricItem>(
    { 
      id: 2,
      name: computed_i18n_Label_ViewSetConfig_Cover_3.value,
      normalStyle: {
        image_url: '../../resources/img/player_theme_3.png',

        textAlign: true,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        player_collapsed_album: false,
        player_collapsed_skin: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_4 = ref<PlayerTheme_LyricItem>(
    { 
      id: 3,
      name: computed_i18n_Label_ViewSetConfig_Cover_4.value,
      normalStyle: {
        image_url: '../../resources/img/player_theme_4.png',

        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        player_collapsed_album: true,
        player_collapsed_skin: true,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_5 = ref<PlayerTheme_LyricItem>(
    { 
      id: 4,
      name: '皮肤底图',
      normalStyle: {
        image_url: '../../resources/img/player_theme_3.png',

        textAlign: false,

        color: '#FAFAFB60',
        fontSize: '22px',
        fontWeight:'800',
        player_collapsed_album: true,
        player_collapsed_skin: false,
      },
      hoverStyle: {
        colorHover: '#FFFFFF'
      }
    }
  );
  const player_theme_Styles = ref<PlayerTheme_LyricItem[]>(
    [
      player_theme_1.value,// play model 1 ：方形封面
      player_theme_2.value,// play model 2 ：旋转封面
      player_theme_3.value,// play model 3 ：炫胶唱片
      player_theme_4.value,// play model 4 ：专辑底图
      // player_theme_5.value, // play model 5 ：皮肤底图  :disabled
    ]
  );

  ////// player bind theme_all
  const player_theme_Styles_Selected = ref<number>(0)
  const player_theme_0_bind_style = ref<PlayerTheme_LyricItem>(player_theme_Styles.value[player_theme_Styles_Selected.value]);
  const player_theme_set_theme = (index:number) => {
    if(index < 0 || index >= player_theme_Styles.value.length){
      return;
    }
    // set theme
    player_theme_0_bind_style.value = player_theme_Styles.value[index];
    //
    player_theme_Styles_Selected.value = index;
    player_background_model_num.value = player_theme_0_bind_style.value.id;
    player_lyric_fontSize.value = player_theme_0_bind_style.value.normalStyle.fontSize;
    player_lyric_fontWeight.value = player_theme_0_bind_style.value.normalStyle.fontWeight;
    player_lyric_color.value = player_theme_0_bind_style.value.normalStyle.color;
    player_collapsed_album.value = player_theme_0_bind_style.value.normalStyle.player_collapsed_album;
    player_collapsed_skin.value = player_theme_0_bind_style.value.normalStyle.player_collapsed_skin;

    player_lyric_panel_fontsize.value = Number(player_lyric_fontSize.value.replace('px',''));

    player_ui_theme.player_theme_Styles_Selected.value = index;
    player_ui_theme.player_background_model_num.value = player_theme_0_bind_style.value.id;
    player_ui_theme.player_lyric_fontSize.value = player_theme_0_bind_style.value.normalStyle.fontSize;
    player_ui_theme.player_lyric_fontWeight.value = player_theme_0_bind_style.value.normalStyle.fontWeight;
    player_ui_theme.player_lyric_color.value = player_theme_0_bind_style.value.normalStyle.color;
    player_ui_theme.player_collapsed_album.value = player_theme_0_bind_style.value.normalStyle.player_collapsed_album;
    player_ui_theme.player_collapsed_skin.value = player_theme_0_bind_style.value.normalStyle.player_collapsed_skin;

    // emits theme
    emits('player_UI_Theme_State' ,player_ui_theme);
  };

  ////// player page_ui set
  const isVisible_Player_theme = ref(false);
  const get_isVisible_Player_theme = () => {
    isVisible_Player_theme.value = !isVisible_Player_theme.value;
  }
  enum LyricAnimation {linebyLine,linebyWord,linebyJump}
  const player_lyric_panel_checked_animation = ref<LyricAnimation>(LyricAnimation.linebyLine)
  const player_lyric_panel_fontsize = ref(24)

  ////// player this_audio(play_info , other_info) model check
  const checkStrategy = ref<'player' | 'related'>('player')

  ////// player_bar auto hidden 
  let timer_auto_hidden: string | number | NodeJS.Timeout | undefined;
  const handleMouseMove = () => {
    emits('player_collapsed_action_bar_of_Immersion_model', false);
    clearInterval(timer_auto_hidden);
    timer_auto_hidden = setInterval(() => {
      emits('player_collapsed_action_bar_of_Immersion_model', true);
    }, 3000);
  };
  const unwatch_player_collapsed = watchEffect(() => {
    if (props.player_collapsed_action_bar_of_Immersion_model === false) {
      clearInterval(timer_auto_hidden);
    }
  });

  ////// Animation lottie Load // lottie-web will cause memory leaks，so replace lottie-player
  import "@lottiefiles/lottie-player";
  const animationInstance_model_1_spectrum = ref<any>(null);
  const animationInstance_model_1_wave = ref<any>(null);
  const animationInstance_model_2_wave = ref<any>(null);
  let unwatch_animationInstance = watch(() => props.this_audio_is_playing, (newValue) => {
    if (newValue === true) {
      if (player_background_model_num.value === 1){
        animationInstance_model_1_spectrum.value.play();
        animationInstance_model_1_wave.value.play();
      }
      if (player_background_model_num.value === 2)
        animationInstance_model_2_wave.value.play();
    } else {
      if (player_background_model_num.value === 1){
        animationInstance_model_1_spectrum.value.pause();
        animationInstance_model_1_wave.value.pause();
      }
      if (player_background_model_num.value === 2)
        animationInstance_model_2_wave.value.pause();
    }
  });

  ////// Load player Configs
  onMounted(() => {
    player_background_model_num.value = props.player_UI_Theme_State.player_background_model_num;
    player_lyric_fontSize.value = props.player_UI_Theme_State.player_lyric_fontSize;
    player_lyric_fontWeight.value = props.player_UI_Theme_State.player_lyric_fontWeight;
    player_lyric_color.value = props.player_UI_Theme_State.player_lyric_color;
    player_collapsed_album.value = props.player_UI_Theme_State.player_collapsed_album;
    player_collapsed_skin.value = props.player_UI_Theme_State.player_collapsed_skin;
    player_theme_Styles_Selected.value = props.player_UI_Theme_State.player_theme_Styles_Selected;
    //
    player_lyric_panel_fontsize.value = Number(player_lyric_fontSize.value.replace('px',''));
  });
  ////// player Remove data
  onBeforeUnmount(() => {
    clearInterval(lyrics_animation);
    clearInterval(timer_auto_hidden);
    unwatch();
    unwatch_animationInstance();
    unwatch_player_collapsed();
    emits('player_collapsed_action_bar_of_Immersion_model', false);
  });
</script>

<template>
  <div style="overflow: hidden;" @mousemove="handleMouseMove" @click="handleMouseMove">
    <!-- background area -->
    <div>
      <!--Album-->
      <img
        v-if="player_collapsed_skin"
        id="player_bg_zindex_0"
        style="
          position: absolute;top: -20vw;left: -10vw;width: 120vw;height: 120vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(60px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError" alt="">
      <!--Skin-->
      <img
        v-else
        id="player_bg_zindex_1"
        style="
          position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(0px);"
        :src="getAssetImage(props.this_audio_file_medium_image_url)"
        @error="handleImageError" alt="">
    </div>
    <!-- drwaer right area -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of Player_theme -->
      <n-drawer 
        v-model:show="isVisible_Player_theme" 
        :width="430"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1); 
          backdrop-filter: blur(10px); 
          margin-top: calc(50vh - 280px);height: 560px;
          ">
        <n-drawer-content v-if="isVisible_Player_theme">
          <template #default>
            <n-radio-group 
              v-model:value="player_theme_Styles_Selected" 
              :on-update:value="player_theme_set_theme"
              name="radiogroup"
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                align-items: center; 
                grid-gap: 0;
                margin-left: 9px;
                margin-top: 12px;">
              <n-radio
                v-for="item in player_theme_Styles" 
                :key="item.id" v-model:value="item.id"
                style="height: 100%;z-index: 9;">
                <n-space vertical justify="center" style="position: relative;left: -27px;z-index: -1;">
                  <img
                    :src="item.normalStyle.image_url"
                    style="
                      width: auto;height: 100px;object-fit: cover;
                      border-radius: 8px;border: 1.5px solid #FFFFFF20;
                    " alt="">
                  <span style="font-size: 16px;position: relative;top: -10px;left: 6px;">
                    {{ item.name }}
                  </span>
                </n-space>
              </n-radio>
            </n-radio-group>
            <n-space style="margin-left: 12px;margin-top: 20px;" justify="space-between">
              <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricSize') }}</span>
              <n-space style="margin-right: 32px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 109px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 24px;" v-if="false" justify="space-between">
              <span style="font-size:16px;">歌词颜色</span>
              <n-space style="margin-right: 32px;">
                <n-button text style="font-size: 24px">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-color-picker style="width: 177px;margin-top: -4px;"/>
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;" justify="space-between">
              <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricSpeed') }}</span>
              <n-space style="margin-right: 32px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 109px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;" v-if="false" justify="space-between">
              <span style="font-size:16px;">歌词行距</span>
              <n-space style="margin-right: 32px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number 
                  v-model:value="player_lyric_panel_fontsize" 
                  clearable
                  style="width: 109px;margin-top: -4px;"
                />
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;">
              <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricsAnimation') }}</span>
              <n-space style="width: 260px;">
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyLine" value="逐行精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyLine">
                  {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_line_1') }}
                </n-radio>
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyWord" value="逐字精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyWord">
                  {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_byte_2') }}
                </n-radio>
                <n-radio
                  :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyJump" value="跳跃精准"
                  @click="player_lyric_panel_checked_animation = LyricAnimation.linebyJump;">
                  {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_jump_3') }}
                </n-radio>
              </n-space>
            </n-space>
            <n-space style="margin-left: 12px;margin-top: 20px;" justify="space-between">
              <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') }}</span>
              <n-space style="margin-right: 32px;">
                <n-button text style="font-size: 24px;margin-top: 2px;">
                  <n-icon>
                    <MotionPhotosAutoOutlined />
                  </n-icon>
                </n-button>
                <n-input-number
                  v-model:value="player_lyric_panel_fontsize"
                  clearable
                  style="width: 109px;margin-top: -4px;"
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
        <!-- top bar -->
        <n-flex 
          justify="space-between" 
          style="transition: margin 0.4s;"
          :style="{ marginTop: player_collapsed_action_bar_of_Immersion_model ? '-70px' : '0px' }">
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
            <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-right: -8px;">
              <n-button quaternary style="margin-right:2px;" @click="get_isVisible_Player_theme">
                <template #icon>
                  <n-icon :depth="3"><Settings24Regular /></n-icon>
                </template>
                <span style="font-weight: 500;">{{ $t('nsmusics.view_player.view_seting.viewSeting') }}</span>
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
        <!-- middle area -->
        <n-config-provider :theme="null">
          <n-flex 
            justify="center" 
            style="transition: margin 0.4s;"
            :style="{ marginTop: player_collapsed_action_bar_of_Immersion_model ? '70px' : '0px' }">
            <n-layout has-sider style="background-color: transparent;">
              <!-- left area --><!-- Album Cover -->
              <!-- show-trigger="bar" calc(50vw + 27vh + 8vw) :show-collapsed-content="false"-->
              <n-layout-sider 
                :collapsed="player_collapsed_album" 
                @collapse="
                  player_ui_theme.player_collapsed_album.value = true;
                  emits('player_UI_Theme_State', player_ui_theme);" 
                @expand="
                  player_ui_theme.player_collapsed_album.value = false;
                  emits('player_UI_Theme_State', player_ui_theme)
                "
                :show-collapsed-content="false" 
                position="static"
                collapsed-width="30vw" width="53vw"
                style="background-color: transparent;">
                <n-space vertical align="end" style="margin-right:6vw;">
                  <!-- 1 方形封面-->
                  <n-space vertical v-if="player_background_model_num === 0">
                    <img
                      style="
                        width: 54vh;height: 54vh;
                        margin-top: calc(28vh - 162px);
                        border: 1.5px solid #FFFFFF20;
                        border-radius: 10px;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 16px 16px 16px rgba(0, 0, 0, 0.20), 0 0 16px rgba(0, 0, 0, 0.20);
                      "
                      :src="getAssetImage(props.this_audio_file_medium_image_url)"
                      @error="handleImageError" alt="">
                    <div
                      style="
                        width: 54vh;margin-left: 2px;color: #E7E5E5;font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ props.this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 54vh;margin-left: 2px;margin-top: -10px;color: #989292;font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
                    </div>
                  </n-space>
                  <!-- 2 旋转封面-->
                  <n-space vertical v-if="player_background_model_num === 1">
                    <lottie-player
                      ref="animationInstance_model_1_wave"
                      autoplay
                      loop
                      mode="normal"
                      src="../../resources/lottie_json/Animation - 1715591164841.json"
                      style="
                        width: calc(60vh);
                        height: calc(60vh);
                        margin-top: calc(26vh - 162px);margin-left: calc(-2vh);
                        position: absolute;
                        transform: scale(1.1);
                      ">
                    </lottie-player>
                    <n-space 
                      style="
                        width: calc(38vh);height: calc(38vh);
                        margin-top: calc(38vh - 162px);margin-left: calc(11vh);
                       ">
                     <img
                       class="animate__rotate_slower"
                       :class="{ 'animate__rotate_slower_paused': !props.this_audio_is_playing }"
                       style="
                        width: calc(34vh);height: calc(34vh);
                        border: 1.5px solid #FFFFFF20;
                        border-radius: 27vh;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                       "
                       :src="getAssetImage(props.this_audio_file_medium_image_url)"
                       @error="handleImageError" alt="">
                    </n-space> 
                    <div
                      style="
                        width: 54vh;margin-left: 2px;color: #E7E5E5;font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: center;">
                      {{ props.this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 54vh;margin-left: 2px;margin-top: -10px;color: #989292;font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: center;">
                      {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
                    </div>
                    <lottie-player
                      ref="animationInstance_model_1_spectrum"
                      autoplay
                      loop
                      mode="normal"
                      src="../../resources/lottie_json/Animation - 1715392202806.json"
                      style="width: 54vh;height:40px;">
                    </lottie-player>
                  </n-space>
                  <!-- 3 炫胶唱片-->
                  <n-space vertical style="margin-top: -2vh;" v-if="player_background_model_num === 2">
                    <lottie-player
                      ref="animationInstance_model_2_wave"
                      autoplay
                      speed="0.8"
                      loop
                      mode="normal"
                      src="../../resources/lottie_json/Animation - 1715417974362.json"
                      style="
                        width: calc(56vh); 
                        height: calc(56vh);
                        margin-top: calc(29vh - 155px);margin-left: calc(13.5vh);
                        position: absolute;
                      ">
                    </lottie-player>
                    <div
                      style="
                        width: calc(38vh); 
                        height: calc(38vh);
                        margin-top: calc(38vh - 162px);margin-left: calc(54vh - 31.5vh);
                        border: 1.5px solid #FFFFFF20;
                        border-radius: 27vh;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                        position: absolute;
                        background-color: #DCDBDD10;
                      ">
                    </div>
                    <img
                      class="animate__rotate_fast"
                      :class="{ 'animate__rotate_fast_paused': !props.this_audio_is_playing }"
                      style="
                        width: calc(54vh - 30vh);height: calc(54vh - 30vh);
                        margin-left: calc(54vh - 24.5vh);
                        margin-top: calc(44vh - 162px);
                        border: 1.5px solid #FFFFFF20;
                        border-radius: 27vh;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                        position: absolute;
                      "
                      :src="getAssetImage(props.this_audio_file_medium_image_url)"
                      @error="handleImageError" alt="">
                    <img
                      style="
                        width: calc(54vh - 12vh);height: calc(54vh - 12vh);
                        WebkitMask-image: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 25%);
                        margin-top: calc(34vh - 162px);
                        border: 2px solid #FFFFFF20;
                        border-radius: 10px;
                        object-fit: cover;object-position: center;
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                        filter: blur(0);
                      "
                      :src="getAssetImage(props.this_audio_file_medium_image_url)"
                      @error="handleImageError" alt="">
                    <div
                      style="
                        width: 54vh;margin-left: 2px;color: #E7E5E5;font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ props.this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 54vh;margin-left: 2px;margin-top: -10px;color: #989292;font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ props.this_audio_singer_name }} -  {{ props.this_audio_album_name }}
                    </div>
                  </n-space>
                </n-space>
              </n-layout-sider>
              <!-- right area --><!-- Lyics Lines List -->
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
                          textAlign: player_collapsed_album ? 'center' : 'left',
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
  padding-left: 20px;padding-top: 0;padding-bottom: 4px;
}

.animate__rotate_slower {
  animation: rotate 60s linear infinite;
  animation-play-state: running;
}
.animate__rotate_slower_paused {
  animation-play-state: paused;
}
.animate__rotate_fast {
  animation: rotate 26s linear infinite;
  animation-play-state: running;
}
.animate__rotate_fast_paused {
  animation-play-state: paused;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>../features/player/Player_UI_Theme_State