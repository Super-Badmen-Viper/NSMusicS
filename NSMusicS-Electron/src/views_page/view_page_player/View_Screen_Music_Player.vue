<script setup lang="ts">
////// this_view resource
import {
  ArrowMinimize16Regular,
  Maximize16Regular,
  FullScreenMaximize16Regular,
  FullScreenMaximize24Filled,
  FullScreenMinimize24Filled,
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
import {darkTheme, NIcon, NSlider} from 'naive-ui'
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

// audio_class & player_bar & player_view
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_view} from "@/store/player/store_player_view";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
import {store_player_appearance} from "@/store/player/store_player_appearance";

////// lyircs load
let unwatch = watch(() => store_player_audio_info.this_audio_lyrics_loaded_complete, (newValue) => {
  if(newValue) {
    load_lyrics();
    store_player_audio_logic.player_slider_click = true;
    scrollToItem(store_player_audio_info.this_audio_lyrics_info_line_num);
  }
});
onMounted(() => {
  load_lyrics()
  init_player_theme()
});
function load_lyrics() {
  if(store_player_audio_info.this_audio_lyrics_string.length > 0) {
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
        handleWheel();
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
            if(store_player_appearance.player_use_lyric_skip_forward){
              itemElements[i].style.color = 'transparent'
            }else{
              itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
            }
            itemElements[i].style.transform = 'scale(1)';
            itemElements[i].style.textShadow = '0 0 0px transparent';
            itemElements[i].style.width = 'calc(40vw)';
          } else if (i !== index) {
            itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
            itemElements[i].style.transform = 'scale(1)';
            itemElements[i].style.textShadow = '0 0 0px transparent';
            itemElements[i].style.width = 'calc(40vw)';
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
  itemElements_active[index].style.fontSize = store_player_appearance.player_lyric_fontSize;
  itemElements_active[index].style.fontWeight = store_player_appearance.player_lyric_fontWeight;

  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  itemElements[index].style.color = store_player_appearance.player_lyric_colorHover;
  itemElements[index].style.filter = 'blur(0px)';
  itemElements[index].style.textShadow = '0 0 1px White';
  itemElements[index].style.transition = 'color 0.5s, transform 0.5s';
  if(!store_player_appearance.player_collapsed_album){
    itemElements[index].style.transform = 'scale(1.1) translateY(0px)';
    itemElements[index].style.transformOrigin = 'left center';
    itemElements[index].style.width = 'calc(36.3vw)'
  }else{
    itemElements[index].style.transform = 'scale(1.1) translateX(0px)';
    itemElements[index].style.transformOrigin = 'center';
    itemElements[index].style.width = 'calc(40vw)'
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
      if(store_player_appearance.player_use_lyric_skip_forward) {
        itemElements[i].style.color = 'transparent'
      }else {
        const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
        itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      }
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.textShadow = '0 0 0px transparent';
      itemElements[i].style.width = 'calc(40vw)'
      itemElements_active[i].style.fontWeight = 400;
    } else if (i != index) {
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (index - i) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
      itemElements[i].style.transform = 'scale(1)';
      itemElements[i].style.textShadow = '0 0 0px transparent';
      itemElements[i].style.width = 'calc(40vw)';
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

    itemElements_active[i].style.fontSize = store_player_appearance.player_lyric_fontSize;
    itemElements_active[i].style.fontWeight = 400;

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

      itemElements_active[i].style.marginRight = `0px`;
      itemElements_active[i].style.width = 'calc(40vw)'
    }
    for (let i = position_i_end; i <= position_i_length; i++) {
      const colorValue = Math.max(store_player_appearance.player_lyric_color_hidden_value - (i - index) * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
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
    itemElements[i].style.color = '#FFFFFF99';
    itemElements[i].style.transform = 'scale(1)';
    itemElements[i].style.filter = 'blur(0px)';
    itemElements[i].style.width = 'calc(40vw)';
  }
};
const handleLeave_Refresh_Lyric_Color = () => {
  lyrics_list_whell.value = false;
  const itemElements = scrollbar.value.$el.querySelectorAll('.lyrics_info');
  let lyric_bottom_hidden_num = store_player_appearance.player_use_lyric_skip_forward
  ? 0 : 10
  let color_hidden = store_player_appearance.player_lyric_color.slice(0, -2);
  for (let i = perviousIndex.value - 16; i <= perviousIndex.value + 16; i++) {
    if (i < perviousIndex.value) {
      const colorValue =
          Math.max(store_player_appearance.player_lyric_color_hidden_value + lyric_bottom_hidden_num
              - (perviousIndex.value - i)
              * store_player_appearance.player_lyric_color_hidden_coefficient, 0);
      try {
        if(store_player_appearance.player_use_lyric_skip_forward){
          itemElements[i].style.color = 'transparent'
        }else{
          itemElements[i].style.color = colorValue === 0 ? 'transparent' : `${color_hidden}${colorValue}`;
        }
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
  store_player_appearance.player_lyric_fontSize_Num = value;
  store_player_appearance.player_lyric_fontSize = value + 'px';
  const itemElements_active = scrollbar.value.$el.querySelectorAll('.lyrics_text_active');
  itemElements_active.forEach((itemElement) => {
    itemElement.style.fontSize = store_player_appearance.player_lyric_fontSize;
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
import Animation_1715591164841 from '@/assets/lottie_json/Animation - 1715591164841.json'
import Animation_1715392202806 from '@/assets/lottie_json/Animation - 1715392202806.json'
import Animation_1715417974362 from '@/assets/lottie_json/Animation - 1715417974362.json'
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
  store_player_appearance.player_lyric_fontSize_Num = 36 + Math.floor((window.innerHeight - 880) / 200) * 6;
  store_player_appearance.player_lyric_fontSize = `${store_player_appearance.player_lyric_fontSize_Num}px`;
}

////// player_configs page_ui set
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
  }, 1000);
};
const unwatch_player_collapsed = watchEffect(() => {
  if (store_player_appearance.player_collapsed_action_bar_of_Immersion_model === false) {
    clearInterval(timer_auto_hidden);
  }
});

////// Animation lottie Load // lottie-web will cause memory leaks，so replace lottie-player_configs
import "@lottiefiles/lottie-player";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic"
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {Random} from "@vicons/fa";
import {Pause, Play, PlayBack, PlayForward, VolumeMedium} from "@vicons/ionicons5";
import Table_Album_Model_1_Cover from "@/views_page/view_page_player/components/Table_Album_Model_1_Cover.vue";
import {ArrowsMaximize, ArrowsMinimize} from "@vicons/tabler";
const clear_lottie_animationInstance = ref(false)
const animationInstance_model_1_spectrum = ref<any>(null);
const animationInstance_model_1_wave = ref<any>(null);
const animationInstance_model_2_wave = ref<any>(null);
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
let unwatch_player_background_model_num = watch(() => store_player_audio_info.player_background_model_num, (newValue) => {
  if(store_player_appearance.player_use_lottie_animation) {
    if (store_player_appearance.player_background_model_num === 0) {
      animationInstance_model_1_spectrum.value.pause();
      animationInstance_model_1_wave.value.pause();
      animationInstance_model_2_wave.value.pause();
    }
    if (store_player_appearance.player_background_model_num === 1){
      animationInstance_model_2_wave.value.pause();
    }
    if (store_player_appearance.player_background_model_num === 2){
      animationInstance_model_1_spectrum.value.pause();
      animationInstance_model_1_wave.value.pause();
    }
  }
});

////// player_configs Remove data
onBeforeUnmount(() => {
  clearInterval(lyrics_animation);
  clearInterval(timer_auto_hidden);
  unwatch();

  unwatch_animationInstance();
  unwatch_player_background_model_num();
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
    <!-- drwaer right area -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of Player_theme -->
      <n-drawer
          v-model:show="store_player_audio_logic.drawer_theme_show"
          :width="420"
          style="
            border-radius: 12px 0 0 12px;
            border: 1.5px solid #FFFFFF20;
            background-color: rgba(127, 127, 127, 0.1);
            backdrop-filter: blur(10px);
            margin-top: calc(50vh - 340px);height: 680px;
          ">
        <n-drawer-content v-if="store_player_audio_logic.drawer_theme_show">
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
                <n-space v-if="false" style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.lyricSize') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-button text style="font-size: 24px;margin-top: 2px;margin-left: 7px;"
                              @click="() => {
                                handleAuto_fontSize(store_player_appearance.player_lyric_fontSize_Num)
                              }">
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
                <n-divider style="margin: 8px 0;width: 336px;"/>
                <n-space justify="space-between">
                  <span style="font-size:16px;">{{
                      $t('nsmusics.view_page.hideHalfLyric')
                    }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch
                      v-model:value="store_player_appearance.player_use_lyric_skip_forward"
                      @update:value="() => {
                        store_player_audio_logic.player_slider_click = true;
                        const index = store_player_view.currentScrollIndex + store_player_audio_info.this_audio_lyrics_info_line_num
                        scrollToItem(index - 3);
                        scrollToItem(index);
                      }"
                    >
                    </n-switch>
                  </n-space>
                </n-space>
                <n-divider style="margin: 8px 0;width: 336px;"/>
                <n-space justify="space-between">
                  <span style="font-size:16px;">{{ $t('nsmusics.view_player.view_seting.coverBaseVague') + ' ' + $t('setting.albumBackground') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch v-model:value="store_player_appearance.player_use_background_filter_blur"/>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('Auto') + $t('MediaInfoRotation') + ' ' + $t('setting.albumBackground') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch v-model:value="store_player_appearance.player_use_background_automatic_rotation"/>
                  </n-space>
                </n-space>
                <n-space style="margin-top: 20px;" justify="space-between">
                  <span style="font-size:16px;">{{ $t('Horizontal') + $t('Vertical') + $t('AspectRatioFill') + ' ' + $t('setting.albumBackground') }}</span>
                  <n-space style="margin-right: 32px;">
                    <n-switch v-model:value="store_player_appearance.player_use_background_repeat_fill"/>
                  </n-space>
                </n-space>
                <n-divider style="margin: 8px 0;width: 336px;"/>
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
                <n-space justify="space-between">
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
      <!-- top bar -->
      <n-flex
          justify="space-between"
          :style="{
            opacity: store_player_appearance.player_collapsed_action_bar_of_Immersion_model
            ? 0 : 1,
            top: store_player_appearance.player_use_lyric_skip_forward
            ? '0' : '4vh',
            transition: 'margin 0.4s, opacity 0.4s',
          }"
          style="
            width: 100vw;
            z-index: 10;
            position: absolute;">
        <n-space
            style="
              -webkit-app-region: no-drag;margin-top: 35px;width: 200px;
            ">
          <div style="width: 200px;"></div>
        </n-space>
        <!-- -->
        <n-flex justify="end" style="width: 400px;height: 70px;">
          <div style="-webkit-app-region: no-drag;margin-top: 30px;margin-right: -8px;">
            <n-tooltip trigger="hover" placement="top"
                       v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
              <template #trigger>
                <n-button
                    quaternary circle
                    style="margin-right:4px;"
                    @click="() => {
                      if(isElectron) {
                        ipcRenderer.send('window-fullscreen');
                      }
                      store_app_configs_info.window_full = !store_app_configs_info.window_full;
                      store_app_configs_info.window_max = store_app_configs_info.window_full;
                    }">
                  <template #icon>
                    <n-icon size="19" :depth="3"
                            v-if="store_app_configs_info.window_full">
                      <ArrowsMinimize/>
                    </n-icon>
                    <n-icon size="19" :depth="3"
                            v-else>
                      <ArrowsMaximize/>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('ButtonFullscreen') }}
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
                    <n-icon size="24" :depth="3"><MinusRound/></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('common.minimize') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top"
                       v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
              <template #trigger>
                <n-button quaternary circle
                          style="margin-right:4px"
                          @click="() => {
                            if(isElectron) {
                              ipcRenderer.send('window-max');
                              }
                            store_app_configs_info.window_max = !store_app_configs_info.window_max;
                            store_app_configs_info.window_full = false;
                          }">
                  <template #icon>
                    <n-icon size="20" :depth="3" v-if="store_app_configs_info.window_max"><FullScreenMinimize24Filled/></n-icon>
                    <n-icon size="20" :depth="3" v-else><FullScreenMaximize24Filled/></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('common.maximize') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top"
                       v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
              <template #trigger>
                <n-button quaternary circle
                          style="margin-right:30px"
                          @click="() => {
                            if(isElectron) {
                              ipcRenderer.send('window-close');
                            }
                          }">
                  <template #icon>
                    <n-icon size="28" :depth="3"><Close/></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Off') }}
            </n-tooltip>
          </div>
        </n-flex>
      </n-flex>
      <n-space vertical>
        <!-- middle area -->
        <n-config-provider :theme="darkTheme">
          <n-flex
              justify="center"
              style="transition: margin 0.4s;overflow: hidden;"
              :style="{
                marginTop: store_player_appearance.player_use_lyric_skip_forward
                ? '70px' : '0px',
                marginLeft: store_player_appearance.player_background_model_num === 2
                ? '36px' : '0px'
              }">
            <n-layout
                has-sider
                :style="{
                  marginTop: store_player_appearance.player_use_lyric_skip_forward ? '0px' : '16px'
                }"
                style="
                  transition: margin 0.4s;
                  overflow: hidden;
                  background-color: transparent;">
              <!-- left area -->
              <n-layout-sider
                  :collapsed="store_player_appearance.player_collapsed_album"
                  @collapse="store_player_appearance.player_collapsed_album = true;"
                  @expand="store_player_appearance.player_collapsed_album = false;"
                  :show-collapsed-content="false"
                  position="static"
                  collapsed-width="30vw" width="54vw"
                  style="background-color: transparent;overflow-y: hidden;">
                <n-space
                    vertical align="end"
                    :class="{
                      'scroll-enabled': store_player_audio_info.this_audio_is_playing
                    }"
                    :style="{
                      marginTop: store_player_appearance.player_use_lyric_skip_forward
                      ? '0px' : '92px',
                      transition: 'margin 0.4s',
                    }"
                    style="margin-right:8vw;">
                  <!-- 1 方形封面-->
                  <Table_Album_Model_1_Cover/>
                  <!-- 2 旋转封面-->
                  <n-flex vertical
                          align="center" justify="center"
                          style="margin-right: calc(-2vw);overflow: hidden;"
                          :style="{
                            marginTop: store_player_appearance.player_background_model_num === 1 ? '0px' : '100px',
                            opacity: store_player_appearance.player_background_model_num === 1 ? 1 : 0,
                            position: store_player_appearance.player_background_model_num === 1 ? 'relative' : 'absolute',
                            left: store_player_appearance.player_background_model_num === 1 ? '0' : '-100%',
                            transition: 'margin 0.4s, opacity 0.8s'
                          }">
                    <lottie-player
                      ref="animationInstance_model_1_wave"
                      class="animate__rotate_slower"
                      :class="{
                        'animate__rotate_slower_paused': store_player_appearance.player_background_model_num !== 1 || !store_player_audio_info.this_audio_is_playing
                      }"
                      v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                      autoplay
                      loop
                      mode="normal"
                      :src="JSON.parse(JSON.stringify(Animation_1715591164841))"
                      :style="{
                        '--background-image': `url(${getAssetImage(store_player_audio_info.page_top_album_image_url)})`
                      }"
                      style="
                        width: 66vh;height: 66vh;
                        margin-top: calc(22vh - 182px);
                      "
                    >
                    </lottie-player>
                    <div
                        style="
                          width: 32vh;margin-top: -14vh;color: #E7E5E5;
                          font-weight: 900;font-size: calc(2.2vh + 4px);
                          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                          text-align: center;">
                      {{ store_player_audio_info.this_audio_song_name }}
                    </div>
                    <div
                        style="
                          width: 26vh;margin-left: 0.2vh;margin-top: -0.8vh;
                          color: #989292;font-weight: 550;font-size: calc(1.4vh + 4px);
                          overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                          text-align: center;">
                      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
                    </div>
                    <lottie-player
                        ref="animationInstance_model_1_spectrum"
                        v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                        autoplay
                        loop
                        mode="normal"
                        :src="JSON.parse(JSON.stringify(Animation_1715392202806))"
                        style="width: 54vh;height:calc(4.7vh);"
                    />
                    <n-space
                        align="center" justify="center"
                        v-if="!store_player_appearance.player_collapsed_album">
                      <n-space style="width: 46px;margin-right: -10px;">
                        {{ store_player_audio_logic.current_play_time }}
                      </n-space>
                      <n-slider
                          style="
                          width: 36vh;
                          --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
                          --n-rail-height: 4px;
                          --n-handle-size: 20px;
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
                          <n-icon-wrapper :size="0" />
                        </template>
                      </n-slider>
                      <n-space style="width: 46px;">
                        {{ store_player_audio_logic.total_play_time }}
                      </n-space>
                    </n-space>
                  </n-flex>
                  <!-- 3 炫胶唱片-->
                  <n-space
                      vertical
                      align="end" justify="center"
                      style="
                        min-width: calc(54vw);
                        position: absolute;
                        overflow: hidden;"
                      :style="{
                        marginTop: store_player_appearance.player_background_model_num === 2
                        ? 'calc(-6vh - 18px)' : '0px',
                        opacity: store_player_appearance.player_background_model_num === 2
                        ? 1 : 0,
                        left: store_player_appearance.player_background_model_num === 2
                        ? (store_player_audio_info.this_audio_is_playing
                           ? '0' : '10%') : '-100%',
                        transition: 'margin 0.4s, left 0.4s, opacity 0.8s'
                      }">
                    <lottie-player
                      ref="animationInstance_model_2_wave"
                      class="animate__rotate_fast"
                      :class="{
                        'animate__rotate_fast_paused': store_player_appearance.player_background_model_num !== 2 || !store_player_audio_info.this_audio_is_playing
                      }"
                      v-if="!clear_lottie_animationInstance && store_player_appearance.player_use_lottie_animation"
                      speed="0.8"
                      autoplay
                      loop
                      mode="normal"
                      :src="JSON.parse(JSON.stringify(Animation_1715417974362))"
                      style="
                        width: calc(56vh);
                        height: calc(56vh);
                        margin-top: calc(32vh - 154px);
                        position: absolute;
                        transition: margin 0.4s, opacity 0.4s;;
                      "
                      :style="{
                        '--background-image': `url(${getAssetImage(store_player_audio_info.page_top_album_image_url)})`,
                        marginLeft: store_player_audio_info.this_audio_is_playing
                        ? 'calc(-56vh)' : 'calc(-70vh)',
                        opacity: store_player_audio_info.this_audio_is_playing
                          ? 1 : 0,
                      }"
                    />
                    <div
                      style="
                        width: calc(38vh);
                        height: calc(38vh);
                        margin-top: calc(41vh - 162px);
                        border-radius: 27vh;
                        object-fit: cover;object-position: center;
                        filter: blur(0px);
                        position: absolute;
                        border: 1.5px solid #FFFFFF20;
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                        background-color: #DCDBDD10;
                        transition: margin 0.4s;
                      "
                      :style="{
                        marginLeft: store_player_audio_info.this_audio_is_playing
                        ? 'calc(-47vh)' : 'calc(-61vh)'
                      }">
                    </div>
                    <div
                        style="
                        position: relative;
                        margin-top: calc(36vh - 162px);margin-left: calc(-74vh);
                        box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
                        width: calc(46vh); height: calc(46vh);">
                      <!-- 图片 -->
                      <img
                        style="
                          width: 100%;height: 100%;
                          border: 1.5px solid #FFFFFF20;
                          border-radius: 10px;
                          object-fit: cover;
                          object-position: center;
                          filter: blur(0);
                          -webkit-mask-image: radial-gradient(
                            circle at 100% 50%, /* 圆形洞的位置（右侧居中） */
                            transparent 4%,   /* 圆形洞的大小 */
                            black 4.2%          /* 遮罩其余部分 */
                          );
                          mask-image: radial-gradient(
                            circle at 100% 50%, /* 圆形洞的位置（右侧居中） */
                            transparent 4%,   /* 圆形洞的大小 */
                            black 4.2%          /* 遮罩其余部分 */
                          );
                        "
                        :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                        alt=""
                      />
                      <div
                        style="
                          width: 4vh;height: 4vh;
                          border-radius: 6vh;border: 1.5px solid #FFFFFF40;
                          position: absolute;top: calc(50% - 2vh);right: calc(-2vh);
                          background-color: #DCDBDD20;
                          transition: right 0.4s, opacity 0.4s;
                        "
                        :style="{
                          right: store_player_audio_info.this_audio_is_playing
                          ? 'calc(-2vh)' : 'calc(12vh)',
                          opacity: store_player_audio_info.this_audio_is_playing
                          ? 1 : 0,
                        }"
                      >

                      </div>
                      <div
                        style="
                          width: 2vh;height: 2vh;
                          border-radius: 2vh;border: 1.5px solid #FFFFFF40;
                          position: absolute;top: calc(50% - 1vh);right: calc(-1vh);
                          background-color: #181818;
                          transition: right 0.4s, opacity 0.4s;
                        "
                        :style="{
                          right: store_player_audio_info.this_audio_is_playing
                          ? 'calc(-1vh)' : 'calc(13vh)',
                          opacity: store_player_audio_info.this_audio_is_playing
                          ? 1 : 0,
                        }"
                      >

                      </div>
                    </div>
                    <div
                        style="
                        width: 46vh;margin-top: 0vh;margin-left: calc(-74vh);
                        color: #E7E5E5;font-weight: 900;font-size: calc(2.2vh + 4px);
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_song_name }}
                    </div>
                    <div
                        style="
                        width: 46vh;margin-top: -1vh;margin-left: calc(-74vh);
                        color: #989292;font-weight: 550;font-size: calc(1.4vh + 4px);
                        overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                        text-align: left;">
                      {{ store_player_audio_info.this_audio_artist_name }} -  {{ store_player_audio_info.this_audio_album_name }}
                    </div>
                    <n-slider
                        style="
                        width: 46vh;
                        --n-fill-color: #ffffff;--n-fill-color-hover: #ffffff;
                        --n-rail-height: 4px;
                        --n-handle-size: 20px;
                        margin-top: -6px;margin-left: calc(-74vh);
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
                        <n-icon-wrapper :size="0" />
                      </template>
                    </n-slider>
                    <div style="width: 46vh;text-align: left;margin-top: -4px;margin-left: calc(-74vh);">
                      {{ store_player_audio_logic.current_play_time }} &nbsp;/&nbsp; {{ store_player_audio_logic.total_play_time }}
                    </div>
                  </n-space>
                </n-space>
              </n-layout-sider>
              <!-- right area -->
              <n-layout-content
                  style="background-color: transparent;overflow: hidden;"
                  :style="{
                    marginLeft: store_player_appearance.player_background_model_num != 3
                    ? '-3vw' : '2vw',
                    marginTop: store_player_appearance.player_use_lyric_skip_forward
                    ? '0px' : '46px'
                  }"
              >
                <div
                  :style="{
                    height: store_player_appearance.player_use_lyric_skip_forward
                    ? 'calc(100vh - 100px)' : 'calc(100vh + 12px)',
                  }"
                  style="
                    width: 40vw;
                    margin-top: -80px;
                    border-radius: 20px;
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
                      width: calc(40vw);
                      max-height: calc(90vh);
                      margin-top: 120px;
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
  position: absolute;
  top: -20vw;
  width: 100vw;
  height: 100vw;
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
  width: calc(40vw);
  margin-top: 6px;line-height: 1.2;
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
  font-size: v-bind(store_player_appearance.player_lyric_fontSize);
  /* display: inline-block;
  white-space: pre; */
  max-width: calc(36vw);
  padding-left: 20px;
  padding-top: 0;
  padding-bottom: 0px;
  transition: color 0.2s;
}

.animate__rotate_slower::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 34vh;
  height: 34vh;
  border-radius: 17vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
  z-index: 2;
  background-image: var(--background-image);
}
.animate__rotate_slower {
  animation: rotate 60s linear infinite;
  animation-play-state: running;
}
.animate__rotate_slower_paused {
  animation-play-state: paused;
}

.animate__rotate_fast::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24vh;
  height: 24vh;
  border-radius: 17vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.20), 0 0 32px rgba(0, 0, 0, 0.20);
  transform: translate(-50%, -50%);
  z-index: 2;
  background-image: var(--background-image);
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