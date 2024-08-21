<script setup lang="ts">
  ////// this_view components of navie ui 
  import { ref, onMounted } from 'vue';
  import {store_player_audio_info} from "@/store/player/store_player_audio_info";
  import {store_playlist_list_info} from "@/store/playlist/store_playlist_list_info";

  ////// scrollbar of playlist_view
  const scrollbar = ref(null as any);
  onMounted(() => {
    if (scrollbar !== null) {
      setTimeout(() => {
        scrollbar.value.scrollToItem(store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list);
      }, 100);
    }
  });

  /////// emits audio_info of artistlist_view_list
  const handleItemDbClick = (media_file:Media_File,index:number) => {
    store_player_audio_info.this_audio_file_path = media_file.path
    store_player_audio_info.this_audio_lyrics_string = media_file.lyrics
    store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url
    store_player_audio_info.this_audio_singer_name = media_file.artist
    store_player_audio_info.this_audio_singer_id = media_file.artist_id
    store_player_audio_info.this_audio_song_name = media_file.title
    store_player_audio_info.this_audio_song_id = media_file.id
    store_player_audio_info.this_audio_song_rating = media_file.rating
    store_player_audio_info.this_audio_song_favorite = media_file.favorite
    store_player_audio_info.this_audio_album_id = media_file.album_id
    store_player_audio_info.this_audio_album_name = media_file.album
    store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = index

    store_player_audio_info.this_audio_restart_play = true
  }
  const handleItemClick_title = (title:string) => {
    
  }
  const handleItemClick_artist = (artist:string) => {
    
  }

  ////// changed_data write to sqlite
  const handleItemClick_Favorite = (id: any,favorite: Boolean) => {
    console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!favorite)
  }
  const handleItemClick_Rating = (id: any,rating: number) => {
    console.log('handleItemClick_Rating_id：'+id+'  _rating:'+rating)
  }
  const handleImageError = (event:any) => {
    event.target.src = '../../../resources/img/error_album.jpg'; // 设置备用图片路径
  };
</script>
<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo">
      <DynamicScroller 
        class="table" ref="scrollbar" style="width: 410px;"
        :items="store_playlist_list_info.playlist_MediaFiles_temporary"
        :minItemSize="50">
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            :data-active="active"
            class="message"
            @Dblclick="handleItemDbClick(item,index)">
            <div class="media_info">
              <div class="lottie_pkay_inlist" v-show="item.playing"
                style="
                  position: absolute;bottom:14px;right:36px;
                  width:50px;height:50px;  
                ">
              
              </div>
              <div 
                style="margin-left: 10px;
                  width: 58px;height: 58px; 
                  border-radius: 6px; border: 1.5px solid #FFFFFF20;
                  overflow: hidden;">
                <img
                  :key="item.id"
                  :src="item.medium_image_url"
                  @error="handleImageError"
                  style="width: 100%; height: 100%; object-fit: cover;"/>
              </div>
              <div class="title_playlist">
                <span @click="handleItemClick_title(item.title)">{{ item.title }}</span>
                <br>
                <template v-for="artist in item.artist.split('/')">
                  <span @click="handleItemClick_artist(artist)">{{ artist + '&nbsp' }}</span>
                </template>
              </div>
              <span class="duration_txt" style="text-align: left;font-size: 15px;">{{ item.duration_txt }}</span>
              <span class="index" style="text-align: left;font-size: 15px;">{{ index + 1 }}</span>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </n-space>
</template>

<style scoped>
.dynamic-scroller-demo {
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.table{
  height: calc(100vh - 212px);
}
.message {
  display: flex;
  align-items: left;
}
.media_info {
  height: 70px;
  display: flex;
  align-items: center;
  border-radius: 6px;

  transition: background-color 0.3s;
}
.media_info:hover {
  background-color: #FFFFFF24;
}
.checkbox{
  width: 20px;
  margin-left: 12px;
}
.index{
  width: 50px;
  margin-left: 12px;
}
.title_playlist{
  margin-left: 10px;
  text-align: left;
  width: 160px;
  font-size: 15px;
  overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.title_playlist :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.love{
  margin-left: 10px;
  text-align: left;
  width: 30px;
}
.love :hover{
  text-decoration: underline;
  cursor: pointer;
  color: #3DC3FF;
}
.duration_txt{
  margin-left: 20px;
  text-align: left;
  width: 50px;
}

::-webkit-scrollbar {
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 6px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 6px;
}
</style>