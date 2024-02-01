<script setup lang="ts">
  import { ref } from 'vue';

  // send this SetInfo
  import { defineEmits } from 'vue';
  const margin_top_value_view_music_player = ref(670);
  const emit = defineEmits();

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
  const click_back_svg = () => {
    svg_shrink_up_arrow.value = 
    svg_shrink_up_arrow.value === 
      '../assets/shrink_up_arrow.svg' ? svg_shrink_down_arrow.value : '../assets/shrink_up_arrow.svg';

    margin_top_value_view_music_player.value = 
      margin_top_value_view_music_player.value === 
        0 ? 670 : 0;
        emit('on-click',margin_top_value_view_music_player.value);
    
    musicplayer_background_color.value =
      musicplayer_background_color.value === 
        '#FFFFFF'?'#FFFFFFE5':'#FFFFFF';
  };

  // binding
  const musicplayer_background_color = ref('#FFFFFF');
  const text_bar_left_text_singer_name = ref('G.E.M 邓紫棋');
  const text_bar_left_text_song_name = ref('你把我灌醉');
  const text_bar_left_text_album_name = ref('The Best of G.E.M. 2008 - 2012 (Deluxe Version)');
  const this_audio_file_path = ref('C:/Users/17741/Music/G.E.M.邓紫棋 - 你把我灌醉.mp3');
  const total_play_time = ref('04:42');
  const current_play_time = ref('01:36');
  const slider_singleValue = ref(60)
  const currentTime_added_value = ref(0)
  const buffer_file = ref(null)
  const player_no_progress_jump = ref(true)

  // audio system
  import { Audio_Players } from '../components/Bar_Music_Player_Vues/Audio_Players';
  const { ipcRenderer } = require('electron');
  let player = new Audio_Players();
  const Init_Audio_Player = async () => {
    // ipcRenderer.send('open-music-file')
    const buffer = await ipcRenderer.invoke('readFile', this_audio_file_path.value);
    buffer_file.value = buffer;
    player.releaseMemory(true);
    player.loadAudio(buffer,true).then(() => {
      // 设置淡入效果，参数为淡入时间（秒）
      //player.setFadein(2);
      // 设置淡出效果，参数为淡出时间（秒）
      //player.setFadeout(2);
      // 设置当前播放进度，参数为播放进度的百分比（0 到 1）
      //player.setCurrentTime(0.5);
      // 获取当前音量，返回值范围：0 到 1
      //const currentVolume = player.getVolume();

      // 播放音频
      player.setVolume(100);
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

          player_no_progress_jump.value = false;
        }
      });
      player.bufferSourceNode.start(player.audioContext.currentTime, player.startTime, player.audioDuration);
      
      // 设置 EQ 均衡器，参数为 bass、mid、treble 的增益值
      // player.setEqualizerGain(1000, 3); // 设置1000Hz频率的增益为3
      // player.setEqualizerBandProperties(2000, {
      //     type: 'highshelf', // 高音增强滤波器
      //     gain: 6,
      // });

      player.isPlaying = true;
      player_no_progress_jump.value = true;
      timer = setInterval(synchronize_playback_time, 200);
      total_play_time.value = formatTime(player.getTotalTime());
    });
  };

 

  // player show value
  const set_slider_singleValue = () => {
    if (isDragging == false) 
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
  const get_current_play_time = () => {
    if((player.getCurrentTime() + currentTime_added_value.value) <= player.getTotalTime())
      current_play_time.value = formatTime((player.getCurrentTime() + currentTime_added_value.value));
  }
  const synchronize_playback_time = () => {
    set_slider_singleValue();
    get_current_play_time();
  }
  let timer: string | number | NodeJS.Timeout | undefined;
  let isDragging = false;
  const handleMouseDown = () => {
    isDragging = true;
  };
  const handleMouseUp = () => {
    isDragging = false;
  };
  const handleInput = () => {
    
    
  };
  const handleclick = async () => {
    player_no_progress_jump.value = false;
    player.releaseMemory(false);
    player.loadAudio(buffer_file.value,false).then(() => {
      player.setVolume(100);
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

          player_no_progress_jump.value = false;
        }
      });
      player.isPlaying = true;
      timer = setInterval(synchronize_playback_time, 200);
      total_play_time.value = formatTime(player.getTotalTime());

      // 注意，此时currentTime将从0开始，需要计算附加值
      let el = <HTMLInputElement>document.getElementById('range');
      let newtime = (1 - Number(el.value) / 100) * player.audioDuration;
      player.bufferSourceNode.start(0,newtime); 
      currentTime_added_value.value = player.audioDuration - newtime
    });

    
  }
  const handleCustomEvent = () => {
    get_current_play_time();
  };
</script>

<template>
  <div class="this_Bar_Music_Player"
      :style="{ backgroundColor:musicplayer_background_color }">
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
        <div class="bar_left_text_song_info">
          <h5 id="bar_singer_name">{{ text_bar_left_text_singer_name}}</h5>
          <h5 id="bar_song_name">{{ text_bar_left_text_song_name }}</h5>
          <h5 id="bar_album_name">{{ text_bar_left_text_album_name }}</h5>
        </div>
      </div>
      <div class="gird_Middle">
        <div class="grid_Middle_button_area">
          <div id="button_order">

          </div>
          <div id="button_previous_song">
            
          </div>
          <div id="button_play" :onClick="Init_Audio_Player">
            
          </div>
          <div id="button_next_song">
            
          </div>
          <div id="button_vioce">
            
          </div>
        </div>
        <div>
          <input id="range" type="range"
            style="width: 90%;bottom: 20;"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @input="handleInput"
            @click="handleclick"
            :min="0" :max="100" :hideTip="true" v-model.value="slider_singleValue"/>
        </div>
      </div>
      <div class="gird_Right">
        <div class="gird_Right_current_playlist_button_area">
          <div>

          </div>
          <h5>999+</h5>
        </div>
        <div class="gird_Right_button_area">
          <div class="gird_Right_button_area_up">
            <div id="button_this_AddLove"></div>
            <div id="button_this_mv"></div>
            <div id="button_this_lysic"></div>
            <div id="button_this_more_info"></div>
          </div>
          <div class="gird_Right_button_area_down">
            <div id="button_audio_speed">
              <h5>倍速</h5>
            </div>
            <div id="button_sound_effects">
              <h5>音效</h5>
            </div>
          </div>
        </div>
        <div class="gird_Right_audio_play_time_area">
          <div>
            <span id="current_play_time">{{ current_play_time }}</span><br>
            <span id="divider_play_time"> ------ </span><br>
            <span id="total_play_time">{{ total_play_time }}</span>
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
  border-radius: 10px;
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
  width: 280px;
  font-size: 16px;
  font-weight: 500;
  color: #595959;

  user-select: none;

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
  color: #8A909E;

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
  color: #595959;

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
  justify-content: space-between;
  align-items: center;
  width: 230px;
  margin: 0px auto;
  margin-top: 10px;
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
  height: 6px;
  bottom: 4px;
  
  cursor: default;
  user-select: none;
}
.gird_Middle #button_order{
  background-image: url(../src/assets/顺序播放.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 1px;
}
.gird_Middle #button_previous_song{
  background-image: url(../src/assets/上一首.svg);
  background-size: 22px 22px;
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
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Middle #button_vioce{
  background-image: url(../src/assets/音量.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 8px;
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
  color: #595959;
  position: absolute;
  top: 10px;
}
.gird_Right .gird_Right_audio_play_time_area #divider_play_time{
  position: absolute;
  top: 28px;
  color: #595959;
}
.gird_Right .gird_Right_audio_play_time_area #total_play_time{
  font-size: 16px;
  color: #595959;
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
.gird_Right .gird_Right_button_area .gird_Right_button_area_up div{
  width: 22px;
  height: 22px;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up #button_this_AddLove{
  background-image: url(../src/assets/收藏.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up #button_this_mv{
  background-image: url(../src/assets/视频.svg);
  background-size: 26px 26px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up #button_this_lysic{
  background-image: url(../src/assets/歌词.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_up #button_this_more_info{
  background-image: url(../src/assets/更多.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down{
  width: 110px;
  height: 30px;
  margin-top: 6px;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down div{
  
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_audio_speed{
  float: left;
  width: 40px;height: 22px;
  border: 1px;
  border-color: #D3DBEA;
  border-style: solid;
  border-radius: 6px;
  color: #283248;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_audio_speed :hover{
  float: left;
  width: 40px;height: 22px;
  border: 1px;
  border-color: #3DC3FF;
  border-style: solid;
  border-radius: 6px;
  color: #3DC3FF;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_audio_speed h5{
  width: 36px;height: 24px;
  font-size: 13px;
  text-wrap: nowrap;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_sound_effects{
  float: left;
  width: 40px;
  width: 40px;height: 22px;
  margin-left: 10px;
  border: 1px;
  border-color: #D3DBEA;
  border-style: solid;
  border-radius: 6px;
  color: #283248;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_sound_effects :hover{
  float: left;
  width: 40px;
  width: 40px;height: 22px;
  border: 1px;
  border-color: #3DC3FF;
  border-style: solid;
  border-radius: 6px;
  color: #3DC3FF;
}
.gird_Right .gird_Right_button_area .gird_Right_button_area_down #button_sound_effects h5{
  width: 36px;height: 24px;
  font-size: 13px;
  text-wrap: nowrap;
}
.gird_Right .gird_Right_current_playlist_button_area{
  width: 60px;
  height: 60px;
  float: right;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: #EEF7FF;
  border-radius: 10px;
}
.gird_Right .gird_Right_current_playlist_button_area :hover{
  color: #3DC3FF;
}
.gird_Right .gird_Right_current_playlist_button_area div{
  width: 60px;
  height: 60px;
  background-image: url(../src/assets/播放队列.svg);
  background-size: 22px 22px;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: -8px;
  position: fixed;
  z-index: 0;
}
.gird_Right .gird_Right_current_playlist_button_area h5{
  font-size: 14px;
  color: #595959;
  position: relative;
  top: 35px;
  z-index: 1;
}

</style>