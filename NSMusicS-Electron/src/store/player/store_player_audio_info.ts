import {reactive, watch} from 'vue'
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {Set_MediaInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
import {store_local_data_set_mediaInfo} from "@/store/local/local_data_synchronization/store_local_data_set_mediaInfo";
import {store_app_configs_logic_load} from "@/store/app/store_app_configs_logic_load";
import {store_local_data_set_albumInfo} from "@/store/local/local_data_synchronization/store_local_data_set_albumInfo";
import {store_playlist_appearance} from "@/store/view/playlist/store_playlist_appearance";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
const path = require('path')
const { ipcRenderer } = require('electron');
interface ByteTime {
    start: number;
    duration: number;
}

export const store_player_audio_info = reactive({
    this_audio_file_path: '',
    this_audio_file_medium_image_url: '',
    this_audio_restart_play: false,
    this_audio_is_playing: true,

    this_audio_artist_name: '',
    this_audio_artist_id: '',
    this_audio_song_name: '',
    this_audio_song_id: '',
    this_audio_album_name: '',
    this_audio_album_id: '',

    this_audio_play_id: '',

    this_audio_Index_of_absolute_positioning_in_list: -1,

    this_audio_song_rating: 0,
    this_audio_song_favorite: false,
    this_audio_album_rating: '',
    this_audio_album_favorite: '',
    this_audio_artist_rating: 0,
    this_audio_artist_favorite: 0,

    page_top_album_image_url: path.resolve('resources/img/error_album.jpg'),
    page_top_album_id: '',
    page_top_album_name: '',

    this_audio_lyrics_string: '',
    this_audio_lyrics_info_line_font: [] as any[],
    this_audio_lyrics_info_line_time: [] as any[],

    this_audio_lyrics_info_byte_model: false,
    this_audio_lyrics_info_byte_font: [] as any[],
    this_audio_lyrics_info_byte_time: [] as any[],

    this_audio_lyrics_info_line_num: 28,

    async reset_data() {
        this.this_audio_file_path = '';
        this.this_audio_file_medium_image_url = '';
        this.this_audio_restart_play = false;
        this.this_audio_is_playing = true;

        this.this_audio_artist_name = '';
        this.this_audio_artist_id = '';
        this.this_audio_song_name = '';
        this.this_audio_song_id = '';
        this.this_audio_album_name = '';
        this.this_audio_album_id = '';

        this.this_audio_Index_of_absolute_positioning_in_list = -1;

        this.this_audio_song_rating = 0;
        this.this_audio_song_favorite = 0;
        this.this_audio_album_rating = '';
        this.this_audio_album_favorite = '';
        this.this_audio_artist_rating = 0;
        this.this_audio_artist_favorite = 0;

        this.page_top_album_image_url = path.resolve('resources/img/error_album.jpg');
        this.page_top_album_id = '';
        this.page_top_album_name = '';

        this.this_audio_lyrics_string = '';
        this.this_audio_lyrics_info_line_font = [] as any[];
        this.this_audio_lyrics_info_line_time = [] as any[];

        this.this_audio_lyrics_info_byte_model = false;
        this.this_audio_lyrics_info_byte_font = [] as any[];
        this.this_audio_lyrics_info_byte_time = [] as any[];

        this.this_audio_lyrics_info_line_num = 28;
    }
});
watch(() => store_player_audio_info.this_audio_file_path, (newValue) => {
    if(newValue != undefined && newValue != 'undefined' && newValue.length > 0) {
        console.log('this_audio_file_path：' + newValue)

        store_player_tag_modify.player_current_media_id = store_player_audio_info.this_audio_song_id
        store_player_tag_modify.player_current_media_path = store_player_audio_info.this_audio_file_path

        if (store_view_media_page_info.media_Files_temporary != undefined
            && store_view_media_page_info.media_Files_temporary.length != 0
        ) {
            store_player_audio_info.this_audio_restart_play = true
            if (!store_player_appearance.player_mode_of_lock_playlist) {
                if (!store_app_configs_logic_load.app_configs_loading) {
                    if(!store_playlist_appearance.playlist_show) {
                        if (store_playlist_list_logic.media_page_handleItemDbClick) {
                            store_playlist_list_fetchData.fetchData_PlayList()
                        }
                    }
                }
            }
        }
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
            item.playing = item.id === store_player_audio_info.this_audio_song_id;
        });
        store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
            item.playing = item.id === store_player_audio_info.this_audio_song_id;
        });

        ipcRenderer.invoke('i18n-tray-label-musicIcon',
            String(store_player_audio_info.this_audio_song_name) + ' - ' + store_player_audio_info.this_audio_artist_name
        );
    }
});
watch(() => store_player_audio_info.this_audio_file_medium_image_url, (newValue) => {
    console.log('this_audio_file_medium_image_url'+newValue)

    store_player_audio_info.this_audio_restart_play = true
    store_player_audio_info.page_top_album_image_url = '';
    store_player_audio_info.page_top_album_image_url = newValue;
});
watch(() => store_player_audio_info.this_audio_song_id, (newValue) => {
    console.log('this_audio_song_id：'+newValue)
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
    store_local_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album(newValue)
});
watch(() => store_player_audio_info.this_audio_lyrics_string, (newValue) => {
    if(newValue === undefined || newValue === 'undefined' || newValue.length === 0){
        store_player_audio_info.this_audio_lyrics_string =
            '[00:01.00]未找到可用歌词\n'
    }
    ////// split lyrics
    store_player_audio_info.this_audio_lyrics_info_line_font = []
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
        store_player_audio_info.this_audio_lyrics_info_line_font.push('')
    }
    //
    let line_all = newValue.split('\n');
    let line_times = [];
    line_all.forEach(line => {
        let timestampMatch = line.match(/^\[(\d+,\d+)\]/);
        if (timestampMatch) {
            let [startMs, durationMs] = timestampMatch[1].split(',').map(Number);
            let minutes = Math.floor(startMs / 60000);
            let seconds = Math.floor((startMs % 60000) / 1000);
            let milliseconds = Math.floor((startMs % 1000) / 10);
            let timestamp = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
            line_times.push(timestamp);
            let lyricsContent = line.replace(timestampMatch[0], '');
            store_player_audio_info.this_audio_lyrics_info_line_font.push(lyricsContent);
        }else{
            let temp = line.split(']')
            if (temp.length > 1) {
                line_times.push(temp[0].replace('[', ''))
                store_player_audio_info.this_audio_lyrics_info_line_font.push(temp[1])
            }
        }
    });
    //////
    store_player_audio_info.this_audio_lyrics_info_byte_model = false
    if (store_player_audio_info.this_audio_lyrics_info_line_font && store_player_audio_info.this_audio_lyrics_info_line_font.length > 0) {
        store_player_audio_info.this_audio_lyrics_info_line_font.forEach((element, index) => {
            let timeFontMatches = element.match(/<(\d+,\d+,\d+)>([^<]+)/g);
            if (timeFontMatches) {
                store_player_audio_info.this_audio_lyrics_info_byte_time[index] = [];
                store_player_audio_info.this_audio_lyrics_info_byte_font[index] = [];
                let timeFontPairs = timeFontMatches.map(match => {
                    let [time, font] = match.split('>');
                    time = time.replace('<', '');
                    return [time.split(',').map(Number), font];
                });
                for (let i = 0; i < timeFontPairs.length; i++) {
                    let [startMs, durationMs, unknown] = timeFontPairs[i][0];
                    let nextStartMs = i < timeFontPairs.length - 1 ? timeFontPairs[i + 1][0][0] : Infinity;

                    if (nextStartMs < startMs + durationMs) {
                        // durationMs = nextStartMs - startMs - 100;
                        durationMs = 100;
                    }

                    store_player_audio_info.this_audio_lyrics_info_byte_time[index].push(`${startMs},${durationMs}`);
                    store_player_audio_info.this_audio_lyrics_info_byte_font[index].push(timeFontPairs[i][1]);
                }

                store_player_audio_info.this_audio_lyrics_info_byte_model = true;
                /// temp
                store_player_audio_info.this_audio_lyrics_info_line_font[index] =
                    store_player_audio_info.this_audio_lyrics_info_byte_font[index].join('');
                ///
            }
        });
    }
    ///
    for (let i = 0; i < store_player_audio_info.this_audio_lyrics_info_line_num; i++) {
        store_player_audio_info.this_audio_lyrics_info_line_font.push('')
    }
    ////// split time of line
    store_player_audio_info.this_audio_lyrics_info_line_time = []
    for (let i = 0; i < line_times.length; i++) {
        const [minutes, seconds] = line_times[i].split(':');
        store_player_audio_info.this_audio_lyrics_info_line_time[i] = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
    }
});