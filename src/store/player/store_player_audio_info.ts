import {reactive, watch} from 'vue'
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_playlist_list_info} from "@/store/playlist/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {Set_MediaInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_app_configs_logic_load} from "@/store/app/store_app_configs_logic_load";
const path = require('path')
const { ipcRenderer } = require('electron');

export const store_player_audio_info = reactive({
    this_audio_file_path: '',
    this_audio_file_medium_image_url: '',
    this_audio_restart_play: false,
    this_audio_is_playing: true,

    this_audio_singer_name: '',
    this_audio_singer_id: '',
    this_audio_song_name: '',
    this_audio_song_id: '',
    this_audio_album_name: '',
    this_audio_album_id: '',

    this_audio_Index_of_absolute_positioning_in_list: -1,

    this_audio_song_rating: 0,
    this_audio_song_favorite: 0,
    this_audio_album_rating: '',
    this_audio_album_favorite: '',
    this_audio_singer_rating: 0,
    this_audio_singer_favorite: 0,

    page_top_album_image_url: path.resolve('resources/img/error_album.jpg'),
    page_top_album_id: '',
    page_top_album_name: '',

    this_audio_lyrics_string: '',
    this_audio_lyrics_info_line: [] as any[],
    this_audio_lyrics_info_time: [] as any[],
    this_audio_lyrics_info_line_num: 28,

    async reset_data() {
        await ipcRenderer.invoke('mpv-stopped');

        this.this_audio_file_path = '';
        this.this_audio_file_medium_image_url = '';
        this.this_audio_restart_play = false;
        this.this_audio_is_playing = true;

        this.this_audio_singer_name = '';
        this.this_audio_singer_id = '';
        this.this_audio_song_name = '';
        this.this_audio_song_id = '';
        this.this_audio_album_name = '';
        this.this_audio_album_id = '';

        this.this_audio_Index_of_absolute_positioning_in_list = -1;

        this.this_audio_song_rating = 0;
        this.this_audio_song_favorite = 0;
        this.this_audio_album_rating = '';
        this.this_audio_album_favorite = '';
        this.this_audio_singer_rating = 0;
        this.this_audio_singer_favorite = 0;

        this.page_top_album_image_url = path.resolve('resources/img/error_album.jpg');
        this.page_top_album_id = '';
        this.page_top_album_name = '';

        this.this_audio_lyrics_string = '';
        this.this_audio_lyrics_info_line = [] as any[];
        this.this_audio_lyrics_info_time = [] as any[];
        this.this_audio_lyrics_info_line_num = 28;
    }
});
watch(() => store_player_audio_info.this_audio_file_path, (newValue) => {
    console.log('this_audio_file_path：'+newValue)

    if(store_view_media_page_info.media_Files_temporary != undefined
        && store_view_media_page_info.media_Files_temporary.length != 0
    ) {
        store_player_audio_info.this_audio_restart_play = true
        if (store_player_appearance.player_mode_of_lock_playlist === false) {
            if(!store_app_configs_logic_load.app_configs_loading) {
                store_playlist_list_info.playlist_MediaFiles_temporary = [...store_view_media_page_info.media_Files_temporary];
                store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
            }
        }
    }
    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        item.playing = item.id === store_player_audio_info.this_audio_song_id;
    });
    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
        item.playing = item.id === store_player_audio_info.this_audio_song_id;
    });
});
watch(() => store_player_audio_info.this_audio_file_medium_image_url, (newValue) => {
    console.log('this_audio_file_medium_image_url'+newValue)

    store_player_audio_info.this_audio_restart_play = true
    store_player_audio_info.page_top_album_image_url = '';
    store_player_audio_info.page_top_album_image_url = newValue;
});
watch(() => store_player_audio_info.this_audio_song_id, (newValue) => {
    console.log('this_audio_song_id：'+newValue)

    store_local_data_set_mediaInfo.Set_MediaInfo_To_PlayCount_of_Media_File(newValue)
});
watch(() => store_player_audio_info.this_audio_song_rating, (newValue) => {
    console.log('this_audio_song_rating：'+newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        if(item.id === store_player_audio_info.this_audio_song_id)
            item.rating = store_player_audio_info.this_audio_song_rating
    });
});
watch(() => store_player_audio_info.this_audio_song_favorite, (newValue) => {
    console.log('this_audio_song_favorite：'+newValue)

    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
        if(item.id === store_player_audio_info.this_audio_song_id)
            item.favorite = store_player_audio_info.this_audio_song_favorite
    });
});
watch(() => store_player_audio_info.this_audio_album_name, (newValue) => {
    console.log('this_audio_album_name：'+newValue)

    store_player_audio_info.page_top_album_name = newValue;
});
watch(() => store_player_audio_info.this_audio_album_id, (newValue) => {
    console.log('this_audio_album_id：'+newValue)

    store_player_audio_info.page_top_album_id = newValue;
});
watch(() => store_player_audio_info.this_audio_lyrics_string, (newValue) => {
    if(newValue === undefined || newValue === 'undefined' || newValue.length === 0){
        store_player_audio_info.this_audio_lyrics_string =
            '[00:01.00]未找到可用歌词\n'
    }
    ////// split lyrics
    store_player_audio_info.this_audio_lyrics_info_line = []
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
        store_player_audio_info.this_audio_lyrics_info_line.push('')
    }
    //
    let line_all = newValue.split('\n')
    let line_times = []
    for (let i = 0; i < line_all.length; i++) {
        let line = line_all[i].split(']')
        if (line.length > 1) {
            line_times.push(line[0].replace('[', ''))
            store_player_audio_info.this_audio_lyrics_info_line.push(line[1])
        }
    }
    //
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
        store_player_audio_info.this_audio_lyrics_info_line.push('')
    }

    //////
    store_player_audio_info.this_audio_lyrics_info_time = []
    for (let i = 0; i < line_times.length; i++) {
        const [minutes, seconds] = line_times[i].split(':');
        store_player_audio_info.this_audio_lyrics_info_time[i] = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
    }
});