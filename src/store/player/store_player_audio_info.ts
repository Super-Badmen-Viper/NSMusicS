import { reactive } from 'vue'

export const store_player_audio_info = reactive({
    this_audio_file_path: '',
    this_audio_file_medium_image_url: '',
    this_audio_restart_play: false,
    this_audio_is_playing: true,
    this_audio_singer_name: '',
    this_audio_singer_id: '',

    this_audio_singer_rating: 0,
    this_audio_singer_favorite: 0,
    this_audio_song_name: '',

    this_audio_song_id: '',

    this_audio_album_rating: '',
    this_audio_album_favorite: '',
    this_audio_Index_of_absolute_positioning_in_list: -1,
});