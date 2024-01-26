<script setup lang="ts">
  import { ref } from 'vue';

  // open view musicplayer
  const svg_shrink_up_arrow = ref<string>('../assets/shrink_up_arrow.svg');
  const svg_shrink_down_arrow = ref<string>('../assets/shrink_down_arrow.svg');
  const back_display = ref('none');
  const back_filter_blurValue  = ref(0);
  function getAssetImage(firstImage: string) {
    return new URL(firstImage, import.meta.url).href;
  }
  const hover_back_img = () => {
    back_display.value = 'block';
    back_filter_blurValue.value = 3;
  };
  const leave_back_svg = () => {
    back_display.value = 'none';
    back_filter_blurValue.value = 0;
  };
  //
  const click_back_svg = () => {
    svg_shrink_up_arrow.value = 
    svg_shrink_up_arrow.value === 
      '../assets/shrink_up_arrow.svg' ? svg_shrink_down_arrow.value : '../assets/shrink_up_arrow.svg';

    margin_top_value_view_music_player.value = 
      margin_top_value_view_music_player.value === 
        0 ? 670 : 0;
    emit('on-click',margin_top_value_view_music_player.value)
  };
  // send margin_top_value_view_music_player
  const margin_top_value_view_music_player = ref(670);
  const emit = defineEmits(['on-click']);

  // 
  const text_bar_left_text_song_name = ref('G.E.M邓紫棋 - 你把我灌醉');
  const text_bar_left_text_album_name = ref('The Best of G.E.M. 2008 - 2012 (Deluxe Version)');

  //
  import { Slider } from 'vue-amazing-ui'
  import 'vue-amazing-ui/css'
  import { watchEffect } from 'vue'
  const slider_singleValue = ref(20)
  watchEffect(() => {
    console.log('singleValue:', slider_singleValue.value)
  })
</script>

<template>
  <div class="this_Bar_Music_Player">
    <div class="layout_distribution_3">
      <div class="gird_Left">
        <div class="button_open_player_view">
          <img class="back_svg" 
              :src="getAssetImage(svg_shrink_up_arrow)" 
              :style="{ display: back_display }"
              @click="click_back_svg" @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
          <img class="back_img" 
              src="../assets/00album.jpg" 
              :style="{ filter: 'blur(' + back_filter_blurValue + 'px)' }"
              @mouseover="hover_back_img" @mouseout="leave_back_svg"/>
        </div>
        <div class="bar_left_text_song_name">
          <h5>{{ text_bar_left_text_song_name }}</h5>
          <h5>{{ text_bar_left_text_album_name }}</h5>
        </div>
      </div>
      <div class="gird_Middle">
          <div class="grid_Middle_button_area">
            <div id="button_order">

            </div>
            <div id="button_previous_song">
              
            </div>
            <div id="button_play">
              
            </div>
            <div id="button_next_song">
              
            </div>
            <div id="button_vioce">
              
            </div>
          </div>
          <div>
            <Slider
              width="80%"
              :min="0" :max="200" :hideTip="true"
              v-model:value="slider_singleValue" />
          </div>
      </div>
      <div class="gird_Right">
        <div class="gird_Right_current_playlist_button_area">

        </div>
        <div class="gird_Right_button_area">
          <div class="gird_Right_button_area_up">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="gird_Right_button_area_down">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
.this_Bar_Music_Player {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 80px;
  z-index: 100;
  background-color: black;
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
  background-color: aliceblue;
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
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.25);
  z-index: 0;
}
.gird_Left .bar_left_text_song_name{
  width: 220px;
  height: 56px;
  margin-top: 12px;margin-left: 14px;
  background-color: aqua;
  float: left;text-align: left;
}
.gird_Left .bar_left_text_song_name :first-child{
  margin-top: 2px;
  font-size: 16px;
  font-weight: 400;
  text-wrap: nowrap;
}
.gird_Left .bar_left_text_song_name :last-child{
  margin-top: 2px;
  font-size: 14px;
  font-weight: 400;
  text-wrap: nowrap;
}

.gird_Middle {
  width: 400px; 
  height: 80px;
  align-items: center;
}
.gird_Middle .grid_Middle_button_area{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 230px;
  margin: 0px auto;
  margin-top: 12px;
}
.gird_Middle .grid_Middle_button_area div{
  width: 34px; 
  height: 34px;
}
.gird_Middle .grid_Middle_button_area :nth-child(3){
  width: 40px; 
  height: 40px;
}
.gird_Middle :last-child{
  margin-bottom: 4px;
}
.gird_Middle #button_order{
  background-image: url(../src/assets/顺序播放.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Middle #button_previous_song{
  background-image: url(../src/assets/上一首.svg);
  background-size: 36px 36px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Middle #button_play{
  background-image: url(../src/assets/播放.svg);
  background-size: 36px 36px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Middle #button_next_song{
  background-image: url(../src/assets/下一首.svg);
  background-size: 36px 36px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Middle #button_vioce{
  background-image: url(../src/assets/歌词未点击.svg);
  background-size: 26px 26px;
  background-repeat: no-repeat;
  background-position: center;

  margin-top: 2px;
}

.gird_Right {
  width: 380px;
  height: 80px;
  background-color: aliceblue;
}
.gird_Right .gird_Right_button_area{
  width: 100px;
  height: 80px;
  background-color: aqua;
  float: right;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up{
  margin-top: 10px;
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up div{
  width: 22px;height: 22px;
  background-color: black;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down{
  width: 100px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down div{
  width: 22px;height: 22px;
  background-color: black;
}
.gird_Right .gird_Right_current_playlist_button_area{
  width: 80px;
  height: 80px;
  background-color: chartreuse;
  float: right;
}

</style>