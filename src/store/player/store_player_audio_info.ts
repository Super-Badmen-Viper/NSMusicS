import { reactive } from 'vue'
const path = require('path');

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
    this_audio_lyrics_info_line: [],
    this_audio_lyrics_info_time: [],
    this_audio_lyrics_info_line_num: 28,
});