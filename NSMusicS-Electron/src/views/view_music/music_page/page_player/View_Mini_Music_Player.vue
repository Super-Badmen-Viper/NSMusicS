<script setup lang="ts">
////// this_view resource
import {
  FullScreenMaximize24Filled,
  FullScreenMinimize24Filled, WindowNew16Regular,
} from '@vicons/fluent'
import {
  MotionPhotosAutoOutlined,
  MinusRound
} from '@vicons/material'
import {
  Close
} from '@vicons/carbon'
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href;
}

////// navie ui views_components
// app theme
import {darkTheme, lightTheme, NIcon, NSlider, NSpace} from 'naive-ui'
// vue3 function
import {ref, watch, watchEffect, onMounted, computed} from 'vue';
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
const computed_i18n_Label_Lyric_Not_Find = computed(() => t('HeaderNoLyrics'));

// audio_class & player_bar & player_view
import {store_player_view} from "@/views/view_music/music_page/page_player/store/store_player_view";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';

////// lyircs load
let unwatch = watch(() => store_player_audio_info.this_audio_lyrics_loaded_complete, (newValue) => {
  if(newValue) {
    load_lyrics();
    store_player_audio_logic.player_slider_click = true;
    scrollToItem(0);
  }
});
onMounted(() => {
  load_lyrics()
  init_player_theme()
});
function load_lyrics() {
  if(store_player_audio_info.this_audio_lyrics_string.length > 0) {
    if(store_player_audio_info.this_audio_lyrics_null){
      store_player_audio_info.this_audio_lyrics_info_line_font.forEach((item: any, index: number) => {
        if ((item != null || item != 'undefined' || item != '') && item === '未找到可用歌词') {
          store_player_audio_info.this_audio_lyrics_info_line_font[index] = computed_i18n_Label_Lyric_Not_Find.value;
        }
      });
    }
    handleAuto_fontSize(store_player_appearance.player_lyric_fontSize_Num)
    begin_lyrics_animation()
    try{
      setTimeout(() => {
        handleLeave_Refresh_Lyric_Color()
      }, 200);
    }catch(e){
      console.log(e)
    }
  }
}
let isFirstRun = true;
function begin_lyrics_animation() {
  setTimeout(() => {
    clearInterval(lyrics_animation);
    lyrics_animation = setInterval(async () => {
      for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_time.length; i++) {
        if (store_player_audio_logic.player !== null && await store_player_audio_logic.player.getCurrentTime() !== undefined && await store_player_audio_logic.player.getCurrentTime() !== null) {
          let currentTime = await store_player_audio_logic.player.getCurrentTime() * 1000;
          if (currentTime <= store_player_audio_info.this_audio_lyrics_info_line_time[0]) {
            if (lyrics_list_whell.value === false && (isFirstRun || store_player_view.currentScrollIndex !== 0)) {
              store_player_view.currentScrollIndex = 0;
              scrollToItem(store_player_audio_info.this_audio_lyrics_info_line_num);
            }
            break;
          } else if (currentTime >= store_player_audio_info.this_audio_lyrics_info_line_time[i]) {
            if (i === store_player_audio_info.this_audio_lyrics_info_line_time.length - 1) {
              if (lyrics_list_whell.value === false && (isFirstRun || store_player_view.currentScrollIndex !== i)) {
                store_player_view.currentScrollIndex = i;
                scrollToItem(i + store_player_audio_info.this_audio_lyrics_info_line_num);
              }
              break;
            } else if (currentTime < store_player_audio_info.this_audio_lyrics_info_line_time[i + 1]) {
              if (lyrics_list_whell.value === false && (isFirstRun || store_player_view.currentScrollIndex !== i)) {
                store_player_view.currentScrollIndex = i;
                scrollToItem(i + store_player_audio_info.this_audio_lyrics_info_line_num);
              }
              break;
            }
          }
        }
      }
      if (isFirstRun) {
        isFirstRun = false;
      }
      if (store_player_audio_logic.player_slider_click) {
        handleClear_Lyric_Color();
        lyrics_list_whell.value = false;
        store_player_audio_logic.player_slider_click = false;
        const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
        const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
        let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
        const index = store_player_view.currentScrollIndex + store_player_audio_info.this_audio_lyrics_info_line_num
        scrollToItem(index);
        for (let i = index - 16; i <= index + 16; i++) {
          const colorValue = Math.max(
              store_player_appearance.player_lyric_color_hidden_value -
              (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient,
              0
          );
          if (i < index) {
            itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
            itemElements[i].style.transform = 'scale(1)';
            itemElements[i].style.textShadow = '0 0 0px transparent';
            itemElements[i].style.width = 'calc(90vw)';
          } else if (i !== index) {
            itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
            itemElements[i].style.transform = 'scale(1)';
            itemElements[i].style.textShadow = '0 0 0px transparent';
            itemElements[i].style.width = 'calc(90vw)';
            itemElements_active[i].style.fontWeight = 400;
          }
        }
      }
    }, 50);
  }, 500);// 防止在歌词列表数据未刷新显示完全而执行歌词项跳转，而导致的面板上移
}
let lyrics_animation: string | number | NodeJS.Timeout | undefined;
const handleItemDbClick = async (index: any) => {
  if (index < store_player_audio_info.this_audio_lyrics_info_line_num)
    return;
  if (index > store_player_audio_info.this_audio_lyrics_info_line_font.length - store_player_audio_info.this_audio_lyrics_info_line_num - 1)
    return;
  const time = store_player_audio_info.this_audio_lyrics_info_line_time[index - store_player_audio_info.this_audio_lyrics_info_line_num];
  if (time >= await store_player_audio_logic.player.getDuration() * 1000)
    return;
  if (time < 0)
    return;
  store_player_audio_logic.player_go_lyric_line_index_of_audio_play_progress = time;
  store_player_view.currentScrollIndex = index;

  handleLeave_Refresh_Lyric_Color()
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
  if(index === 0){
    return;
  }

  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
  itemElements_active[index].style.fontSize = '20px';
  itemElements_active[index].style.fontWeight = store_player_appearance.player_lyric_fontWeight;

  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  itemElements[index].style.color = store_player_appearance.player_lyric_colorHover;
  itemElements[index].style.filter = 'blur(0px)';
  itemElements[index].style.textShadow = '0 0 1px White';
  itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
  if(!store_player_appearance.player_collapsed_album){
    itemElements[index].style.transform = 'scale(1.1) translateY(0px)';
    itemElements[index].style.transformOrigin = 'left center';
    itemElements[index].style.width = 'calc(82vw)'
  }else{
    itemElements[index].style.transform = 'scale(1.1) translateX(0px)';
    itemElements[index].style.transformOrigin = 'center';
    itemElements[index].style.width = 'calc(90vw)'
  }
  if(store_player_view.currentScrollIndex === 0)
    itemElements[index].scrollIntoView({ block: 'center', behavior: 'instant'});
  else
    itemElements[index].scrollIntoView({ block: 'center', behavior: 'smooth'});
  // 设置前后16列的颜色
  handleLeave_Refresh_Lyric_Color()
  // 设置perviousIndex.value列的颜色
  let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
  for (let i = index - 16; i <= index + 16; i++) {
    if (i < index) {
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.textShadow = '0 0 0px transparent';
      itemElements[i].style.width = 'calc(90vw)'
      itemElements_active[i].style.fontWeight = 400;
    } else if (i != index) {
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.textShadow = '0 0 0px transparent';
      itemElements[i].style.width = 'calc(90vw)';
      itemElements_active[i].style.fontWeight = 400;
    }
  }
  perviousIndex.value = index;

  if(isFirstRun) {
    store_player_audio_logic.player_slider_click = true
  }

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

    itemElements_active[i].style.fontSize = '20px';
    itemElements_active[i].style.fontWeight = 400;

    itemElements_active[i].style.filter = 'blur(0px)';
    itemElements_active[i].style.transition = 'color 0.5s, transform 0.5s';
    if (!store_player_appearance.player_collapsed_album) {
      itemElements_active[i].style.transform = 'scale(1.1) translateY(0px)';
      itemElements_active[i].style.transformOrigin = 'left center';
      itemElements_active[i].style.width = 'calc(82vw)'
    } else {
      itemElements_active[i].style.transform = 'scale(1.1) translateX(0px)';
      itemElements_active[i].style.transformOrigin = 'center';
      itemElements_active[i].style.width = 'calc(90vw)'
    }
  }

  for (let i = position_i_start; i < position_i_end; i++) {
    const byteTime = store_player_audio_info.this_audio_lyrics_info_byte_time[index][i - position_i_start];
    const [startMs, durationMs] = byteTime.split(',').map(Number);
    const start = startMs / 1000;
    const duration = durationMs / 1000;``

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
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      itemElements_active[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      itemElements_active[i].style.transform = 'scale(1)';
      itemElements_active[i].style.background = `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`;
      itemElements_active[i].style.backgroundClip = `text`;
      itemElements_active[i].style.textShadow = `0 0 2px transparent`;

      itemElements_active[i].style.width = 'calc(90vw)'
    }
    for (let i = position_i_end; i <= position_i_length; i++) {
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (i - index) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      itemElements_active[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      itemElements_active[i].style.transform = 'scale(1)';
      itemElements_active[i].style.background = `linear-gradient(90deg, #FFFFFF 0px, #FAFAFB60 0px) 0 0`;
      itemElements_active[i].style.backgroundClip = `text`;
      itemElements_active[i].style.textShadow = `0 0 2px transparent`;

      itemElements_active[i].style.width = 'calc(90vw)'
    }
  }catch {}
};
let intervals = [];
const lyrics_list_whell = ref(false);
const handleWheel = (event: any) => {
  handleClear_Lyric_Color()
};
function handleClear_Lyric_Color (){
  lyrics_list_whell.value = true;
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  for (let i = 0; i < itemElements.length; i++) {
    itemElements[i].style.color = '#FFFFFF99';
    itemElements[i].style.transform = 'scale(1)';
    itemElements[i].style.filter = 'blur(0px)';
    itemElements[i].style.width = 'calc(90vw)';
  }
}
const handleLeave_Refresh_Lyric_Color = () => {
  lyrics_list_whell.value = false;
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  let lyric_bottom_hidden_num = 10
  let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
  for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
    if (i < perviousIndex.value) {
      const colorValue =
          Math.max(store_player_appearance.player_lyric_color_hidden_value + lyric_bottom_hidden_num
              - (perviousIndex.value - i)
              * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      try {
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      }catch{  }
    } else {
      const colorValue =
          Math.max(store_player_appearance.player_lyric_color_hidden_value + lyric_bottom_hidden_num
              - (i - perviousIndex.value)
              * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      try {
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      }catch{  }
    }
  }
};
const handleAuto_fontSize = (value: number) =>{
  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
  itemElements_active.forEach((itemElement) => {
    itemElement.style.fontSize = '20px';
    itemElement.style.fontWeight = 400;
  })
  let marginTop = 6 + Math.floor((window.innerHeight - 880) / 200) * 0.5;
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  itemElements.forEach((itemElement) => {
    itemElement.style.marginTop = marginTop;
    itemElement.style.lineHeight = marginTop * 2 * 0.1;
  })
}
watch(() => store_player_appearance.player_lyric_fontSize_Num, (newValue) => {
  handleLeave_Refresh_Lyric_Color()
  handleAuto_fontSize(newValue)
});

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
import player_theme_1_png from '@/assets/img/player_theme_1.png'
import player_theme_2_png from '@/assets/img/player_theme_2.png'
import player_theme_3_png from '@/assets/img/player_theme_3.png'
import player_theme_4_png from '@/assets/img/player_theme_4.png'
const player_theme_1 = ref<PlayerTheme_LyricItem>(
    {
      id: 0,
      name: computed_i18n_Label_ViewSetConfig_Cover_1.value,
      normalStyle: {
        image_url: player_theme_1_png,

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
        image_url: player_theme_2_png,

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
        image_url: player_theme_3_png,

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
        image_url: player_theme_4_png,

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
        image_url: player_theme_3_png,

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

  const index_lyric = store_player_view.currentScrollIndex + store_player_audio_info.this_audio_lyrics_info_line_num
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  if(!store_player_appearance.player_collapsed_album){
    itemElements[index_lyric].style.transformOrigin = 'left center';
  }else{
    itemElements[index_lyric].style.transformOrigin = 'center';
  }

  init_player_theme()

  store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
};
function init_player_theme(){
  if(store_player_appearance.player_background_model_num === 0){
    store_player_appearance.player_show_of_control_info = false
  }else{
    store_player_appearance.player_show_of_control_info = true
  }
}

////// player_bar auto hidden
let timer_auto_hidden: string | number | NodeJS.Timeout | undefined;
const collapsed_action_bar = ref(false)
const handleMouseMove = () => {
  collapsed_action_bar.value = false
  clearInterval(timer_auto_hidden);
  timer_auto_hidden = setInterval(() => {
    if(store_player_appearance.player_use_playbar_auto_hide) {
      collapsed_action_bar.value = true
    }
  }, 1000);
};
const unwatch_player_collapsed = watchEffect(() => {
  if (collapsed_action_bar.value === false) {
    clearInterval(timer_auto_hidden);
  }
});

////// Animation lottie Load // lottie-web will cause memory leaks，so replace lottie-player_configs
import {store_player_appearance} from "@/views/view_music/music_page/page_player/store/store_player_appearance";
import {store_player_audio_info} from "@/views/view_music/music_page/page_player/store/store_player_audio_info";
import {store_player_audio_logic} from "@/views/view_music/music_page/page_player/store/store_player_audio_logic"
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";

///
const show_mini_album_model  = ref(false);
const hover_back_img = () => {
  show_mini_album_model.value = true
};
const leave_back_svg = () => {
  show_mini_album_model.value = false
};

////// player_configs Remove data
onBeforeUnmount(() => {
  clearInterval(lyrics_animation);
  clearInterval(timer_auto_hidden);
  unwatch();

  unwatch_player_collapsed();
  collapsed_action_bar.value = false
});
</script>

<template>
  <div style="overflow: hidden;" @mousemove="handleMouseMove" @click="handleMouseMove">
    <!-- background area -->
    <div>
      <!--Album-->
      <div
        v-if="store_player_appearance.player_collapsed_skin"
        id="player_bg_zindex_0"
        :style="{
          backgroundImage: `url(${getAssetImage(store_player_audio_info.page_top_album_image_url)})`,
          filter: store_player_appearance.player_use_background_filter_blur ?
            'brightness(46%) blur(40px)' : 'brightness(46%) blur(0px)',
          backgroundSize: store_player_appearance.player_use_background_repeat_fill ? '20vw auto' : 'cover',
          backgroundRepeat: store_player_appearance.player_use_background_repeat_fill ? 'repeat' : 'no-repeat',
          backgroundPosition: 'center'
        }"
        :class="{
          'player_bg_zindex_0_auto_rotateDefault': store_player_appearance.player_use_background_automatic_rotation && !store_player_appearance.player_use_background_repeat_fill,
          'player_bg_zindex_0_auto_rotateRepeat': store_player_appearance.player_use_background_automatic_rotation && store_player_appearance.player_use_background_repeat_fill
        }"
      ></div>
      <!--Skin-->
      <img
          v-else
          id="player_bg_zindex_0"
          style="
          position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;
          margin-top: -20vw;
          object-fit: cover;object-position: center;
          filter: brightness(46%) blur(0px);"
          :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
          alt="">
      <div style="background-color: #000000;z-index: -3;position: absolute;top: 0;left: 0;width: 100vw;height: 100vw;">

      </div>
    </div>
    <!-- body -->
    <n-space vertical :size="12" style="z-index: 99;overflow: hidden;">
      <!-- top bar -->
      <n-flex
          justify="space-between"
          style="
            width: 100vw;
            z-index: 10;
            position: absolute;">
        <n-config-provider :theme="darkTheme">
          <n-flex justify="end" style="width: 110px;height: 70px;position: absolute;right: 10px;">
            <div
              :style="{
                marginRight: collapsed_action_bar ? '-150px' : 0,
                opacity: collapsed_action_bar ? 0 : 1,
                transition: 'opacity 0.4s, margin 0.4s',
              }"
              style="-webkit-app-region: no-drag;margin-top: 10px;">
              <n-tooltip trigger="hover" placement="top"
                         v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                <template #trigger>
                  <n-button quaternary circle style="margin-right:4px"
                            @click="async () => {
                              if(isElectron) {
                                // 请不要更改这段诡异的代码，它依靠Electron的BUG运行，呵呵
                                ipcRenderer.send('window-state-miniplayer');
                                ipcRenderer.send('window-state-miniplayer');
                                //
                                store_app_configs_info.window_state_miniplayer = !store_app_configs_info.window_state_miniplayer
                                //await ipcRenderer.invoke('get-window-state-miniplayer');
                              }
                            }">
                    <template #icon>
                      <n-icon size="24" :depth="2"><WindowNew16Regular/></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('nsmusics.view_player.view_player_mini') }}
              </n-tooltip>
              <n-tooltip trigger="hover" placement="top"
                         v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                <template #trigger>
                  <n-button quaternary circle
                            style="margin-right:4px"
                            @click="() => {
                              if(isElectron) {
                                ipcRenderer.send('window-min');
                              }
                            }">
                    <template #icon>
                      <n-icon size="24" :depth="2"><MinusRound/></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('common.minimize') }}
              </n-tooltip>
              <n-tooltip trigger="hover" placement="top"
                         v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                <template #trigger>
                  <n-button quaternary circle
                            @click="() => {
                              if(isElectron) {
                                ipcRenderer.send('window-close');
                              }
                            }">
                    <template #icon>
                      <n-icon size="28" :depth="2"><Close/></n-icon>
                    </template>
                  </n-button>
                </template>
                {{ $t('Off') }}
              </n-tooltip>
            </div>
          </n-flex>
          <n-flex justify="start" style="width: 400px;height: 70px;">
            <div class="gird_Left">
              <n-tooltip trigger="hover" placement="top">
                <template #trigger>
                  <div class="button_open_player_view">
                    <n-button
                        class="mini_album"
                        :style="{
                          opacity: show_mini_album_model ? 1 : 0,
                          transition: 'opacity 0.4s',
                        }"
                        @mouseover="hover_back_img" @mouseout="leave_back_svg"
                        quaternary>
                      <template #icon>
                        <n-icon size="24" :depth="2"><WindowNew16Regular/></n-icon>
                      </template>
                    </n-button>
                    <img class="back_img"
                         style="object-fit: cover;"
                         :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                         @mouseover="hover_back_img" @mouseout="leave_back_svg"
                    />
                  </div>
                </template>
                {{ $t('setting.hotkey_toggleFullScreenPlayer') }}
              </n-tooltip>
              <div class="bar_left_text_info">
                <n-space>
                  <n-ellipsis
                      :style="{
                        width: collapsed_action_bar ? '280px' : '130px',
                        transition: 'width 0.4s, margin 0.4s',
                      }"
                      style="color: white;">
                    <span id="bar_so_name">{{ store_player_audio_info.this_audio_song_name}}</span>
                  </n-ellipsis>
                </n-space>
                <n-space style="margin-top: 6px;">
                  <n-ellipsis style="width: 280px;color: #929292;">
                    <template v-for="artist in store_player_audio_info.this_audio_artist_name.split(/[\/|｜]/)">
                      <span id="bar_ar_name_part">{{ artist + '&nbsp' }}</span>
                    </template>
                    <span id="bar_al_name">{{ '-&nbsp' + store_player_audio_info.this_audio_album_name }}</span>
                  </n-ellipsis>
                </n-space>
              </div>
            </div>
          </n-flex>
        </n-config-provider>
      </n-flex>
      <n-space vertical justify="center">
        <!-- middle area -->
        <n-config-provider :theme="darkTheme">
          <n-flex
              justify="center"
              style="transition: margin 0.4s;overflow: hidden;margin-top: 70px;">
            <div
                style="
                  height: 620px;
                  border-radius: 20px;
                  margin-top: -110px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  overflow: hidden;
                ">
              <n-list
                  clickable
                  :show-divider="false"
                  ref="scrollbar"
                  @wheel="handleWheel"
                  @mouseleave="() => {
                    handleLeave_Refresh_Lyric_Color();
                    store_player_view.currentScrollIndex = 0;
                    begin_lyrics_animation();
                  }"
                  style="
                    width: calc(90vw);
                    height: 530px;
                    overflow: auto;
                    background-color: #00000000;
                  ">
                <template #default>
                  <n-list-item
                      class="lyrics_info"
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
            <n-space
                align="center" justify="center" style="margin-top: -82px;">
              <n-space style="width: 32px;font-size: 12px;color: #898989;">
                {{ store_player_audio_logic.current_play_time }}
              </n-space>
              <n-slider
                  style="
                    width: 36vh;
                    --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
                    --n-rail-height: 3px;
                    --n-handle-size: 10px;
                    border-radius: 10px;"
                  v-model:value="store_player_audio_logic.slider_singleValue"
                  :min="0" :max="100"
                  :format-tooltip="(value) => {
                          return store_player_audio_logic.formatTime(
                            (value / 100) * store_player_audio_logic.player.isDuration
                          );
                        }"
                  :on-dragend="()=>{
                          if(store_player_audio_logic.slider_singleValue >= 99.5 || store_player_audio_logic.slider_singleValue == 0){
                            store_player_audio_logic.player_is_play_ended = true;
                            store_player_audio_logic.play_go_duration(store_player_audio_logic.slider_singleValue,true);
                          }
                          store_player_audio_logic.player_range_duration_isDragging = false;
                        }"
                  @click="()=>{
                          store_player_audio_logic.play_go_duration(store_player_audio_logic.slider_singleValue,true);
                        }"
                  @mousedown="store_player_audio_logic.player_range_duration_isDragging = true"
                  @mouseup="store_player_audio_logic.player_range_duration_isDragging = false">
                <template #thumb>
                  <n-icon-wrapper color="white" :size="8" />
                </template>
              </n-slider>
              <n-space style="width: 32px;font-size: 12px;color: #898989">
                {{ store_player_audio_logic.total_play_time }}
              </n-space>
            </n-space>
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
  position: absolute;
  top: -20vh;
  width: 200vh;
  height: 200vh;
  object-fit: cover;
  object-position: center;
  z-index: -2;
  transition: filter 0.5s ease;
}
.player_bg_zindex_0_auto_rotateDefault{
  animation: moveInCircleDefault 60s linear infinite;
  transform-origin: center center;
}
.player_bg_zindex_0_auto_rotateRepeat{
  animation: moveInCircleRepeat 60s linear infinite;
  transform-origin: center center;
}
@keyframes moveInCircleDefault {
  0% {
    transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) rotate(0deg) scale(120%);
  }
  25% {
    transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) rotate(90deg) scale(160%);
  }
  50% {
    transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) rotate(180deg) scale(200%);
  }
  75% {
    transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) rotate(270deg) scale(160%);
  }
  100% {
    transform: translate(calc(50px * cos(360deg)), calc(50px * sin(360deg))) rotate(360deg) scale(120%);
  }
}
@keyframes moveInCircleRepeat {
  0% {
    transform: translate(calc(50px * cos(0deg)), calc(50px * sin(0deg))) rotate(0deg) scale(120%);
  }
  25% {
    transform: translate(calc(50px * cos(90deg)), calc(50px * sin(90deg))) rotate(90deg) scale(200%);
  }
  50% {
    transform: translate(calc(50px * cos(180deg)), calc(50px * sin(180deg))) rotate(180deg) scale(280%);
  }
  75% {
    transform: translate(calc(50px * cos(270deg)), calc(50px * sin(270deg))) rotate(270deg) scale(200%);
  }
  100% {
    transform: translate(calc(50px * cos(360deg)), calc(50px * sin(360deg))) rotate(360deg) scale(120%);
  }
}

.lyrics_info {
  /* color: v-bind(player_lyric_color); */
  color: transparent;
  margin-top: 6px;line-height: 1.2;padding-left: 8px;
  min-height: 50px;
  cursor: pointer;
  border-radius: 10px;
  transition: color 0.5s, background-color 0.5s;
  filter: blur(0.07px);
}
.lyrics_info:hover {
  background-color: #FFFFFF16;
}
.lyrics_text_active {
  font-size: 20px;
  /* display: inline-block;
  white-space: pre; */
  transition: color 0.2s;
}

.gird_Left {
  width: 350px;
  height: 80px;
  margin-left: -2px;margin-top: 6px;

  cursor: default;
  user-select: none;
}
.gird_Left .button_open_player_view{
  width: 60px;height: 60px;
  margin-top: 10px;margin-left: 20px;
  float: left;
}
.gird_Left .button_open_player_view .mini_album{
  width: 60px;height: 60px;
  border-radius: 10px;
  position: absolute;
  z-index: 1;
}
.gird_Left .button_open_player_view .back_img{
  width: 60px;height: 60px;
  border-radius: 4px;
  z-index: 0;
}
.gird_Left .bar_left_text_info{
  width: 240px;
  height: 50px;
  margin-top: 12px;margin-left: 14px;
  float: left;text-align: left;
}
.gird_Left .bar_left_text_info #bar_so_name{
  font-size: 16px;
  font-weight: 600;
  color: white;
}
.gird_Left .bar_left_text_info #bar_ar_name_part {
  font-size: 16px;
  font-weight: 600;
  color: #929292;
}
.gird_Left .bar_left_text_info #bar_al_name{
  font-size: 16px;
  font-weight: 600;
  color: #929292;
}

::-webkit-scrollbar {
  display: none;
}
</style>