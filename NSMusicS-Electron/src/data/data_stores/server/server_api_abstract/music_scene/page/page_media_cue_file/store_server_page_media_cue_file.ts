import {reactive} from "vue";

export const store_server_page_media_cue_file = reactive({
    back_image_url: '',
    cover_image_url: '',
    disc_image_url: '',
    has_cover_art: false,
    cue_tracks: [],
    cue_track_count: 0,
    cue_duration: 0,
});