<script setup lang="ts">
  ////// this_view resource
  import {
    ArrowMinimize16Regular, Maximize16Regular,
    ChevronDown12Filled, Settings24Regular, FullScreenMaximize16Regular
  } from '@vicons/fluent'
  import {
    MotionPhotosAutoOutlined
  } from '@vicons/material'
  import {
    Close,Clean
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

  ////// navie ui components
  // app theme
  import {darkTheme, NIcon, NSlider} from 'naive-ui'
  // vue3 function
  import { ref, watch, watchEffect, onMounted, computed } from 'vue';
  import { onBeforeUnmount } from 'vue';

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })
  const computed_i18n_Label_ViewSetConfig_Cover_1 = computed(() => t('nsmusics.view_player.view_seting.coverSquare_1'));
  const computed_i18n_Label_ViewSetConfig_Cover_2 = computed(() => t('nsmusics.view_player.view_seting.coverRotate_2'));
  const computed_i18n_Label_ViewSetConfig_Cover_3 = computed(() => t('nsmusics.view_player.view_seting.coverBeaut_3'));
  const computed_i18n_Label_ViewSetConfig_Cover_4 = computed(() => t('nsmusics.view_player.view_seting.coverBase_4'));

  // audio_class & player_bar
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";

  ////// System BrowserWindow Set
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function maximize_screen() {
    ipcRenderer.send('window-fullscreen');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  function close_media_player() {
    if(store_player_appearance.player_show_complete)
      store_player_appearance.player_show_click = true
  }

  ////// lyircs load
  let unwatch = watch(() => store_player_audio_info.this_audio_lyrics_string, (value) => {load_lyrics()});
  onMounted(() => {load_lyrics()});
  function load_lyrics() {
    if(store_player_audio_info.this_audio_lyrics_string.length > 0) {
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
    lyrics_animation = setInterval(async () => {
      for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_time.length; i++) {
        if (store_player_audio_logic.player !== null && await store_player_audio_logic.player.getCurrentTime() !== undefined && await store_player_audio_logic.player.getCurrentTime() !== null) {
          let currentTime = await store_player_audio_logic.player.getCurrentTime() * 1000;
          if (currentTime <= store_player_audio_info.this_audio_lyrics_info_line_time[0]) {
            if (lyrics_list_whell.value === false) {
              scrollToItem(store_player_audio_info.this_audio_lyrics_info_line_num);
            }
            break;
          } else if (currentTime >= store_player_audio_info.this_audio_lyrics_info_line_time[i]) {
            if (i === store_player_audio_info.this_audio_lyrics_info_line_time.length - 1) {
              if (lyrics_list_whell.value === false) {
                scrollToItem(i + store_player_audio_info.this_audio_lyrics_info_line_num);
              }
              break;
            } else if (currentTime < store_player_audio_info.this_audio_lyrics_info_line_time[i + 1]) {
              if (lyrics_list_whell.value === false) {
                scrollToItem(i + store_player_audio_info.this_audio_lyrics_info_line_num);
              }
              break;
            }
          }
        }
      }
    }, 50);
  }
  let lyrics_animation: string | number | NodeJS.Timeout | undefined;
  const handleItemDbClick = async (index: any) => {
    if (index < store_player_audio_info.this_audio_lyrics_info_line_num) return;
    if (index > store_player_audio_info.this_audio_lyrics_info_line_font.length - store_player_audio_info.this_audio_lyrics_info_line_num - 1) return;
    const time = store_player_audio_info.this_audio_lyrics_info_line_time[index - store_player_audio_info.this_audio_lyrics_info_line_num];
    if (time >= await store_player_audio_logic.player.getDuration() * 1000) return;
    if (time < 0) return;
    store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress = time;
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
    itemElements_active[index].style.fontSize = store_player_appearance.player_lyric_fontSize;
    itemElements_active[index].style.fontWeight = store_player_appearance.player_lyric_fontWeight;

    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    itemElements[index].style.color = store_player_appearance.player_lyric_colorHover;
    itemElements[index].style.filter = 'blur(0px)';
    itemElements[index].style.textShadow = '0 0 1px White';
    itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
    if(store_player_appearance.player_collapsed_album === false){
      itemElements[index].style.transform = 'scale(1.1) translateY(0px)';
      itemElements[index].style.transformOrigin = 'left center';
      itemElements[index].style.width = 'calc(36.3vw)'
    }else{
      itemElements[index].style.transform = 'scale(1.1) translateX(0px)';
      itemElements[index].style.transformOrigin = 'center';
      itemElements[index].style.width = 'calc(40vw)'
    }
    itemElements[index].scrollIntoView({ block: 'center', behavior: perviousIndex.value === index - 1 ? 'smooth' : 'instant' });

    let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
    for (let i = index - 16; i <= index + 16; i++) {
      if (i < index) {
        const colorValue = Math.max(90 - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.transform = 'scale(1)';
        itemElements[i].style.textShadow = '0 0 0px transparent';
        itemElements[i].style.width = 'calc(40vw)'
      } else if (i != index) {
        const colorValue = Math.max(90 - (i - index) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements[i].style.transform = 'scale(1)';
        itemElements[i].style.textShadow = '0 0 0px transparent';
        itemElements[i].style.width = 'calc(40vw)'
      }
    }
    perviousIndex.value = index;

    // if(store_player_audio_info.this_audio_lyrics_info_byte_model) {
    //   if(store_player_audio_logic.player.isPlaying) {
    //     startByteAnimations(index, 0)
    //   }
    // }
  };
  const lastIndex = ref(-1);
  const startByteAnimations = (index: number, num: number) => {
    const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
    let position_i_length = store_player_audio_info.this_audio_lyrics_info_byte_time
        .reduce((acc: any, curr: any) => {
          return acc + curr.length;
        }, 0);
    let position_i_start = store_player_audio_info.this_audio_lyrics_info_byte_time
        .slice(0, index)
        .reduce((acc: any, curr: any) => {
          return acc + curr.length;
        }, 0);
    let position_i_end = store_player_audio_info.this_audio_lyrics_info_byte_time
        .slice(0, index + 1)
        .reduce((acc: any, curr: any) => {
          return acc + curr.length;
        }, 0);

    if (index === lastIndex.value) {
      return;
    }
    lastIndex.value = index;

    // Clear previous intervals
    if (intervals.length > 0) {
      intervals.forEach(clearInterval);
      intervals = [];
    }

    // lyric width length
    let elementWidth = 0;
    for (let i = position_i_start; i < position_i_end; i++) {
      const element = itemElements_active[i];
      const computedStyle = window.getComputedStyle(element);
      elementWidth += parseFloat(computedStyle.width);

      itemElements_active[i].style.fontSize = store_player_appearance.player_lyric_fontSize;
      itemElements_active[i].style.fontWeight = store_player_appearance.player_lyric_fontWeight;

      itemElements_active[i].style.filter = 'blur(0px)';
      itemElements_active[i].style.transition = 'color 0.5s, transform 0.5s';
      if (!store_player_appearance.player_collapsed_album) {
        itemElements_active[i].style.transform = 'scale(1.1) translateY(0px)';
        itemElements_active[i].style.transformOrigin = 'left center';
        itemElements_active[i].style.width = 'calc(36.3vw)'
      } else {
        itemElements_active[i].style.transform = 'scale(1.1) translateX(0px)';
        itemElements_active[i].style.transformOrigin = 'center';
        itemElements_active[i].style.width = 'calc(40vw)'
      }

      let tempwidth = parseFloat(window.getComputedStyle(itemElements_active[i]).width);
      itemElements_active[i].style.marginRight = `${tempwidth / 10}px`;
    }

    for (let i = position_i_start; i < position_i_end; i++) {
      const byteTime = store_player_audio_info.this_audio_lyrics_info_byte_time[index][i - position_i_start];
      const [startMs, durationMs] = byteTime.split(',').map(Number);
      const start = startMs / 1000;
      const duration = durationMs / 1000;

      setTimeout(() => {
        itemElements_active[i].style.animationDuration = `${duration}s`;
        let leftPx = 0;
        const interval = setInterval(() => {
          if (leftPx <= elementWidth) {
            leftPx += 1;
            itemElements_active[i].style.background = `linear-gradient(90deg, #FFFFFF ${leftPx}px, #FAFAFB60 0px) 0 0`;
            itemElements_active[i].style.backgroundClip = `text`;
            itemElements_active[i].style.color = `transparent`;
            itemElements_active[i].style.textShadow = `0 0 2px rgba(255, 255, 255, 0.4)`;
          } else {
            clearInterval(interval);
          }
        }, (duration * 1000) / 30);

        intervals.push(interval);
      }, start * 1000);
    }

    try {
      let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
      for (let i = 0; i < position_i_start; i++) {
        const colorValue = Math.max(90 - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        itemElements_active[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements_active[i].style.transform = 'scale(1)';
        itemElements_active[i].style.background = `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`;
        itemElements_active[i].style.backgroundClip = `text`;
        itemElements_active[i].style.textShadow = `0 0 2px transparent`;

        itemElements_active[i].style.marginRight = `0px`;
        itemElements_active[i].style.width = 'calc(40vw)'
      }
      for (let i = position_i_end; i <= position_i_length; i++) {
        const colorValue = Math.max(90 - (i - index) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        itemElements_active[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        itemElements_active[i].style.transform = 'scale(1)';
        itemElements_active[i].style.background = `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`;
        itemElements_active[i].style.backgroundClip = `text`;
        itemElements_active[i].style.textShadow = `0 0 2px transparent`;

        itemElements_active[i].style.marginRight = `0px`;
        itemElements_active[i].style.width = 'calc(40vw)'
      }
    }catch {}
  };
  let intervals = [];
  const lyrics_list_whell = ref(false);
  const handleWheel = (event: any) => {
    lyrics_list_whell.value = true;
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    for (let i = 0; i < itemElements.length; i++) {
      itemElements[i].style.color = store_player_appearance.player_lyric_color;
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.filter = 'blur(0px)';
      itemElements[i].style.width = 'calc(40vw)'
    }
  };
  const handleLeave = () => {
    lyrics_list_whell.value = false;
    const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
    let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
    for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
      if (i < perviousIndex.value) {
        const colorValue = Math.max(90 - (perviousIndex.value - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        try {
          itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        }catch{  }
      } else {
        const colorValue = Math.max(90 - (i - perviousIndex.value) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        try {
          itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        }catch{  }
      }
    }
  };
  const handleAuto_fontSize = (value: number) =>{
    store_player_appearance.player_lyric_fontSize_Num = value;
    store_player_appearance.player_lyric_fontSize = value + 'px';
    const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
    itemElements_active.forEach((itemElement) => {
      itemElement.style.fontSize = store_player_appearance.player_lyric_fontSize;
      itemElement.style.fontWeight = store_player_appearance.player_lyric_fontWeight;
    })
  }

  ////// player_configs theme BasicInfo
  type PlayerTheme_Style = {
    image_url: any;

    textAlign: any;

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
  };
  const player_theme_1 = ref<PlayerTheme_LyricItem>(
    {
      id: 0,
      name: computed_i18n_Label_ViewSetConfig_Cover_1.value,
      normalStyle: {
        image_url: '../../resources/img/player_theme_1.png',

        textAlign: true,

        player_collapsed_album: false,
        player_collapsed_skin: true,
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

        player_collapsed_album: false,
        player_collapsed_skin: true,
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

        player_collapsed_album: false,
        player_collapsed_skin: true,
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

        player_collapsed_album: true,
        player_collapsed_skin: true,
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

        player_collapsed_album: true,
        player_collapsed_skin: false,
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

  ////// player_configs bind theme_all
  const player_theme_0_bind_style = ref<PlayerTheme_LyricItem>(player_theme_Styles.value[
      store_player_appearance.player_theme_Styles_Selected
      ]);
  const player_theme_set_theme = (index:number) => {
    if(index < 0 || index >= player_theme_Styles.value.length){
      return;
    }
    // set theme
    player_theme_0_bind_style.value = player_theme_Styles.value[index];

    store_player_appearance.player_theme_Styles_Selected = index;
    store_player_appearance.player_background_model_num = player_theme_0_bind_style.value.id;
    store_player_appearance.player_collapsed_album = player_theme_0_bind_style.value.normalStyle.player_collapsed_album;
    store_player_appearance.player_collapsed_skin = player_theme_0_bind_style.value.normalStyle.player_collapsed_skin;

    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
  };

  ////// player_configs page_ui set
  const isVisible_Player_theme = ref(false);
  const get_isVisible_Player_theme = () => {
    isVisible_Player_theme.value = !isVisible_Player_theme.value;
  }
  enum LyricAnimation {linebyLine,linebyWord,linebyJump}
  const player_lyric_panel_checked_animation = ref<LyricAnimation>(LyricAnimation.linebyLine)

  ////// player_configs this_audio(play_info , other_info) model check
  const checkStrategy = ref<'player' | 'related'>('player')

  ////// player_bar auto hidden
  let timer_auto_hidden: string | number | NodeJS.Timeout | undefined;
  const handleMouseMove = () => {
    store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
    clearInterval(timer_auto_hidden);
    timer_auto_hidden = setInterval(() => {
      if(store_player_appearance.player_use_playbar_auto_hide) {
        store_player_appearance.player_collapsed_action_bar_of_Immersion_model = true
      }
    }, 3000);
  };
  const unwatch_player_collapsed = watchEffect(() => {
    if (store_player_appearance.player_collapsed_action_bar_of_Immersion_model === false) {
      clearInterval(timer_auto_hidden);
    }
  });

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

  ////// Animation lottie Load // lottie-web will cause memory leaks，so replace lottie-player_configs
  import "@lottiefiles/lottie-player";
  import {store_player_appearance} from "@/store/player/store_player_appearance";
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  import {store_player_audio_logic} from "@/store/player/store_player_audio_logic"
  import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
  const clear_lottie_animationInstance = ref(false)
  const animationInstance_model_1_spectrum = ref<any>(null);
  const animationInstance_model_1_spectrum_json = JSON.parse(JSON.stringify('../../resources/lottie_json/Animation - 1715392202806.json'))
  const animationInstance_model_1_wave = ref<any>(null);
  const animationInstance_model_1_wave_json = JSON.parse(JSON.stringify('../../resources/lottie_json/Animation - 1715591164841.json'))
  const animationInstance_model_2_wave = ref<any>(null);
  const animationInstance_model_2_wave_json = JSON.parse(JSON.stringify('../../resources/lottie_json/Animation - 1715417974362.json'))
  let unwatch_animationInstance = watch(() => store_player_audio_info.this_audio_is_playing, (newValue) => {
    if(store_player_appearance.player_use_lottie_animation) {
      if (newValue === true) {
        if (store_player_appearance.player_background_model_num === 1) {
          animationInstance_model_1_spectrum.value.play();
          animationInstance_model_1_wave.value.play();
        }
        if (store_player_appearance.player_background_model_num === 2)
          animationInstance_model_2_wave.value.play();
      } else {
        if (store_player_appearance.player_background_model_num === 1) {
          animationInstance_model_1_spectrum.value.pause();
          animationInstance_model_1_wave.value.pause();
        }
        if (store_player_appearance.player_background_model_num === 2)
          animationInstance_model_2_wave.value.pause();
      }
    }
  });

  ////// player_configs Remove data
  onBeforeUnmount(() => {
    clearInterval(lyrics_animation);
    clearInterval(timer_auto_hidden);
    unwatch();

    unwatch_animationInstance();
    if(store_player_appearance.player_use_lottie_animation) {
      animationInstance_model_1_spectrum.value.destroy()
      animationInstance_model_1_wave.value.destroy()
      animationInstance_model_2_wave.value.destroy()
    }
    clear_lottie_animationInstance.value = true

    unwatch_player_collapsed();
    store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
  });
</script>

<template>
  <div style="overflow: hidden;" @mousemove="handleMouseMove" @click="handleMouseMove">
    <!-- background area -->
    <div>
      <!--Album-->
      <img
        v-if="store_player_appearance.player_collapsed_skin"
        id="player_bg_zindex_0"
        style="
          position: absolute;
          top: -20vw;
          left: -10vw;
          width: 120vw;
          height: 120vw;
          object-fit: cover;
          object-position: center;"
        :style="{ filter: store_player_appearance.player_use_background_filter_blur ? 'brightness(46%) blur(60px)' : 'brightness(46%) blur(0px)' }"
        :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
        @error="handleImageError"
        alt=""
      />
      <!--Skin-->
      <img
        v-else
        id="player_bg_zindex_1"
        style="
          position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(0px);"
        :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
        @error="handleImageError" alt="">
    </div>
    <!-- drwaer right area -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of Player_theme -->
      <n-drawer
        v-model:show="isVisible_Player_theme"
        :width="420"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 290px);height: 580px;
          ">
        <n-drawer-content v-if="isVisible_Player_theme">
          <template #default>
            <n-space vertical align="center">
              <n-space vertical style="width: 380px;">
                <n-radio-group
                  v-model:value="store_player_appearance.player_theme_Styles_Selected"
                  @update:value="player_theme_set_theme"
                  name="radiogroup" :width="430"
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
              </n-space>
              <n-space vertical align="start" style="width: 320px;margin-left: -26px;">
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricSize') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;margin-left: 7px;"
                              @click="handleAuto_fontSize(24)">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="store_player_appearance.player_lyric_fontSize_Num"
                      @update:value="handleAuto_fontSize"
                      clearable
                      :min="6" :max="200"
                      style="width: 109px;margin-top: -4px;margin-left: 12px;"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" v-if="false" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricWright') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;"
                              @click="handleAuto_fontSize(24)">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                        v-model:value="store_player_appearance.player_lyric_fontSize_Num"
                        @update:value="handleAuto_fontSize"
                        clearable
                        style="width: 109px;margin-top: -4px;"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 24px;" v-if="false" justify="space-between">
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
                <n-space style="margin-top: 20px;" v-if="false" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricSpeed') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="store_player_appearance.player_lyric_fontSize"
                      clearable
                      style="width: 109px;margin-top: -4px;"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" v-if="false" justify="space-between">
                  <span style="font-size:16px;">歌词行距</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="store_player_appearance.player_lyric_fontSize"
                      clearable
                      style="width: 109px;margin-top: -4px;"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" v-if="false" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricsAnimation') }}</span>
                  <n-space style="width: 260px;margin-top: 2px;">
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyLine"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyLine">
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_line_1') }}
                    </n-radio>
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyWord"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyWord">
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_byte_2') }}
                    </n-radio>
                    <n-radio
                      :checked="player_lyric_panel_checked_animation === LyricAnimation.linebyJump"
                      @click="player_lyric_panel_checked_animation = LyricAnimation.linebyJump;">
                      {{ $t('nsmusics.view_player.view_seting.lyricsAnimation_jump_3') }}
                    </n-radio>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.player_use_lottie') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch
                      v-model:value="store_player_appearance.player_use_lottie_animation"
                      @update:value="
                        player_theme_set_theme(store_player_appearance.player_theme_Styles_Selected);
                      "
                    >
                    </n-switch>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch v-model:value="store_player_appearance.player_use_background_filter_blur"/>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" v-if="false" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;">
                      <n-icon>
                        <MotionPhotosAutoOutlined />
                      </n-icon>
                    </n-button>
                    <n-input-number
                      v-model:value="store_player_appearance.player_lyric_fontSize"
                      clearable
                      style="width: 109px;margin-top: -4px;"
                    />
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.player_use_playbar_auto_hide') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch v-model:value="store_player_appearance.player_use_playbar_auto_hide"/>
                  </n-space>
                </n-space>
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
          :style="{ marginTop: store_player_appearance.player_collapsed_action_bar_of_Immersion_model ? '-70px' : '0px' }">
          <n-flex style="width: 400px;height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-left:30px;">
              <n-button quaternary size="medium"
                style="margin-right:4px" @click="close_media_player">
                <template #icon>
                  <n-icon size="30" :depth="3"><ChevronDown12Filled/></n-icon>
                </template>
              </n-button>
            </div>
          </n-flex>
          <!-- -->
          <n-space
            style="
              -webkit-app-region: no-drag;margin-top: 35px;
            ">
<!--            <n-button quaternary @click="get_isVisible_Player_theme">-->
<!--              <span style="font-weight: 500;">{{ $t('page.sidebar.nowPlaying') }}</span>-->
<!--            </n-button>-->
<!--            <n-button quaternary @click="get_isVisible_Player_theme">-->
<!--              <span style="font-weight: 500;">{{ $t('page.fullscreenPlayer.related') }}</span>-->
<!--            </n-button>-->
<!--            <n-radio-group size="small" v-model:value="checkStrategy">-->
<!--              <n-radio-button-->
<!--                style="-->
<!--                  &#45;&#45;n-button-border-color-active: #FFFFFF;-->
<!--                  &#45;&#45;n-button-box-shadow-focus: inset 0 0 0 1px #FFFFFF, 0 0 0 2px rgba(255, 255, 255, 0.3);-->
<!--                  &#45;&#45;n-button-box-shadow-hover: inset 0 0 0 1px #FFFFFF;-->
<!--                  &#45;&#45;n-button-color-active: #FFFFFF;-->
<!--                  &#45;&#45;n-button-text-color-hover: #FFFFFF;"-->
<!--                size="small" value="player">-->
<!--                播放-->
<!--              </n-radio-button>-->
<!--              <n-radio-button-->
<!--                style="-->
<!--                  &#45;&#45;n-button-border-color-active: #FFFFFF;-->
<!--                  &#45;&#45;n-button-box-shadow-focus: inset 0 0 0 1px #FFFFFF, 0 0 0 2px rgba(255, 255, 255, 0.3);-->
<!--                  &#45;&#45;n-button-box-shadow-hover: inset 0 0 0 1px #FFFFFF;-->
<!--                  &#45;&#45;n-button-color-active: #FFFFFF;-->
<!--                  &#45;&#45;n-button-text-color-hover: #FFFFFF;"-->
<!--                size="small" value="related">-->
<!--                相关-->
<!--              </n-radio-button>-->
<!--            </n-radio-group>-->
          </n-space>
          <!-- -->
          <n-flex justify="end" style="width: 400px;height: 70px;">
            <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-right: -8px;">
              <n-button quaternary circle style="margin-right:0px;" @click="ipcRenderer.send('window-reset-data');">
                <template #icon>
                  <n-icon :depth="3"><Clean /></n-icon>
                </template>
<!--                <span style="font-weight: 500;">{{ $t('setting.clearQueryCache') }}</span>-->
              </n-button>
              <n-button quaternary style="margin-right:2px;" @click="get_isVisible_Player_theme">
                <template #icon>
                  <n-icon :depth="3"><Settings24Regular /></n-icon>
                </template>
                <span style="font-weight: 500;">{{ $t('nsmusics.view_player.view_seting.viewSeting') }}</span>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px;" @click="maximize_screen">
                <template #icon>
                  <n-icon size="20" :depth="3" style="margin-top: 1px;"><FullScreenMaximize16Regular/></n-icon>
                </template>
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
        <n-config-provider :theme="darkTheme">
          <n-flex
            justify="center"
            style="transition: margin 0.4s;"
            :style="{ marginTop: store_player_appearance.player_collapsed_action_bar_of_Immersion_model ? '70px' : '0px' }">
            <n-layout has-sider style="background-color: transparent;">
              <!-- left area -->
              <n-layout-sider
                :collapsed="store_player_appearance.player_collapsed_album"
                @collapse="store_player_appearance.player_collapsed_album = true;"
                @expand="store_player_appearance.player_collapsed_album = false;"
                :show-collapsed-content="false"
                position="static"
                collapsed-width="30vw" width="53vw"
                style="background-color: transparent;">
                <n-space vertical align="end" style="margin-right:6vw;">
                  <!-- 1 方形封面-->
                  <n-space vertical v-show="store_player_appearance.player_background_model_num === 0">
                    <img
                      style="
                        width: 54vh;height: 54vh;
                        margin-top: calc(28vh - 182px);
                        border: 1.5px solid #FFFFFF20;
                        border-radius: 10px;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        box-shadow: 16px 16px 16px rgba(0, 0, 0, 0.20), 0 0 16px rgba(0, 0, 0, 0.20);
                      "
                      :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
                      @error="handleImageError" alt="">
                    <div
                      style="
                        width: 54vh;margin-left: 2px;
                        color: #E7E5E5;
                        font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 54vh;margin-left: 2px;margin-top: -10px;color: #989292;font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
                    </div>
                  </n-space>
                  <!-- 2 旋转封面-->
                  <n-space vertical style="margin-top: -12px;" v-show="store_player_appearance.player_background_model_num === 1">
                    <lottie-player
                      ref="animationInstance_model_1_wave" v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                      autoplay
                      loop
                      mode="normal"
                      :src="animationInstance_model_1_wave_json"
                      style="
                        width: calc(60vh);
                        height: calc(60vh);
                        margin-top: calc(24vh - 162px);margin-left: calc(-2vh);
                        position: absolute;
                        transform: scale(1.1);
                      "
                    />
                    <div>
                      <img
                        class="animate__rotate_slower"
                        :class="{ 'animate__rotate_slower_paused': !store_player_audio_info.this_audio_is_playing }"
                        style="
                          width: calc(36vh);height: calc(36vh);
                          margin-top: calc(35vh - 162px);margin-left: calc(10vh);
                          border: 1.5px solid #FFFFFF20;
                          border-radius: 27vh;
                          object-fit: cover;object-position: center;
                          filter: blur(0px);
                          box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                         "
                          :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
                          @error="handleImageError" alt="">
                      <div
                        style="
                          width: 54vh;margin-left: 2px;margin-top: 8px;color: #E7E5E5;font-weight: 900;font-size: 26px;
                          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                          text-align: center;">
                        {{ store_player_audio_info.this_audio_song_name }}
                      </div>
                      <div
                        style="
                          width: 54vh;margin-left: 2px;margin-top: 0px;color: #989292;font-weight: 550;font-size: 18px;
                          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                          text-align: center;">
                        {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
                      </div>
                    </div>
                    <lottie-player
                      ref="animationInstance_model_1_spectrum" v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                      autoplay
                      loop
                      mode="normal"
                      :src="animationInstance_model_1_spectrum_json"
                      style="width: 54vh;height:40px;"
                    />
                  </n-space>
                  <!-- 3 炫胶唱片-->
                  <n-space vertical style="margin-top: calc(-3vh - 18px);" v-show="store_player_appearance.player_background_model_num === 2">
                    <lottie-player
                      ref="animationInstance_model_2_wave" v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                      speed="0.8"
                      autoplay
                      loop
                      mode="normal"
                      :src="animationInstance_model_2_wave_json"
                      style="
                        width: calc(56vh);
                        height: calc(56vh);
                        margin-top: calc(29vh - 154.5px);margin-left: calc(13.5vh);
                        position: absolute;
                      "
                    />
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
                      :class="{ 'animate__rotate_fast_paused': !store_player_audio_info.this_audio_is_playing }"
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
                      :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
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
                      :src="getAssetImage(store_player_audio_info.this_audio_file_medium_image_url)"
                      @error="handleImageError" alt="">
                    <div
                      style="
                        width: 54vh;margin-left: 2px;color: #E7E5E5;font-weight: 900;font-size: 26px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_song_name }}
                    </div>
                    <div
                      style="
                        width: 54vh;margin-left: 2px;margin-top: -10px;margin-bottom: 12px;
                        color: #989292;font-weight: 550;font-size: 18px;
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
                    </div>
                  </n-space>
                  <!--  -->
                  <n-space v-if="!store_player_appearance.player_collapsed_album" style="margin-top: -12px;">
                    {{ store_player_audio_logic.current_play_time }}
                    <n-slider
                      style="
                        width: calc(54vh - 96px);
                        --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
                        --n-rail-height: 4px;
                        margin-top: 2px;
                        border-radius: 10px;"
                      :value="store_player_audio_logic.slider_singleValue"
                      :min="0" :max="100" :tooltip="false"
                    >
                      <template #thumb>
                        <n-icon-wrapper :size="0" />
                      </template>
                    </n-slider>
                    {{ store_player_audio_logic.total_play_time }}
                  </n-space>
                </n-space>
              </n-layout-sider>
              <!-- right area -->
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
                    clickable
                    :show-divider="false"
                    ref="scrollbar"
                    @wheel="handleWheel"
                    @mouseleave="handleLeave"
                    style="
                      width: calc(40vw);
                      max-height: calc(68vh);
                      overflow: auto;
                      background-color: #00000000;
                    ">
                    <template #default>
                      <n-list-item
                        class="lyrics_info"
                        :style="{
                          textAlign: store_player_appearance.player_collapsed_album ? 'center' : 'left',
                        }"
                        v-for="(item, index) in store_player_audio_info.this_audio_lyrics_info_line_font"
                        @click="handleItemDbClick(index)">
                        <div class="lyrics_text_active">
                          {{ item }}
                        </div>
<!--                        v-if="!store_player_audio_info.this_audio_lyrics_info_byte_model"-->
<!--                        <div v-else-->
<!--                          v-for="(byte, num) in store_player_audio_info.this_audio_lyrics_info_byte_font[index]"-->
<!--                          class="lyrics_text_active"-->
<!--                          style="padding-left: 0;margin-right: 1px;"-->
<!--                        >-->
<!--                          {{ byte }}-->
<!--                        </div>-->
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
#player_bg_zindex_0 {
  z-index: -2;
  transition: filter 0.5s ease;
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
  font-size: v-bind(store_player_appearance.player_lyric_fontSize);
  font-weight: v-bind(store_player_appearance.player_lyric_fontWeight);
  //display: inline-block;
  //white-space: pre;
  max-width: calc(36vw);
  padding-left: 20px;
  padding-top: 0;
  padding-bottom: 0px;
  transition: color 0.2s;
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
</style>