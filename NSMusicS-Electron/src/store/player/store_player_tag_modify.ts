import {reactive, watch} from 'vue'
const path = require('path')
const { ipcRenderer } = require('electron');
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";

export const store_player_tag_modify = reactive({
    player_show_tag_modify: false,

    player_show_tag_kind: 'media',

    player_current_media_path: '',
    player_current_media_id: '',
    player_current_media_starred: undefined,
    player_current_media_playCount: undefined,
    player_current_media_playDate: undefined,
    player_current_media_tag: {
        title: undefined,
        path: undefined,
        albumArtists: undefined,
        artist: undefined,
        album: undefined,
        discCount: undefined,
        trackCount: undefined,
        year: undefined,
        genres: undefined,
        duration: undefined,
        isCompilation: undefined,

        codec: undefined,
        audioBitrate: undefined,
        audioChannels: undefined,

        sizeOnDisk: undefined,
        albumPeak: undefined,
        trackPeak: undefined,
        comment: undefined,
        lyrics: undefined,
    },

    player_current_album_id: '',
    player_current_album_starred: undefined,
    player_current_album_playCount: undefined,
    player_current_album_playDate: undefined,
    player_current_album_tag: {
        title: undefined,
        albumArtists: undefined,
        artist: undefined,
        album: undefined,
        year: undefined,
        genres: undefined,
        duration: undefined,
        isCompilation: undefined,
        songCount: undefined
    },

    player_current_artist_id: '',
    player_current_artist_starred: undefined,
    player_current_artist_playCount: undefined,
    player_current_artist_playDate: undefined,
    player_current_artist_tag: {
        artist: undefined,
        genres: undefined,
        albumCount: undefined,
    }
});
watch(() => store_player_tag_modify.player_show_tag_modify, async (newValue) => {
    if(newValue) {
        if(store_server_user_model.model_server_type_of_local) {
            /// modify 'local media file tag' and 'database $media_file$ info'
            if(store_player_tag_modify.player_show_tag_kind === 'media') {
                if (store_player_tag_modify.player_current_media_path != undefined && store_player_tag_modify.player_current_media_path.length > 0) {
                    const local_file = await ipcRenderer.invoke('node-taglib-sharp-get-media-path',
                        store_player_tag_modify.player_current_media_path
                    );
                    /// local model | database media_file
                    if (local_file) {
                        // read local file tag
                        store_player_tag_modify.player_current_media_tag = await ipcRenderer.invoke('node-taglib-sharp-get-media-tag',
                            store_player_tag_modify.player_current_media_path
                        );
                    }
                    /// server model | database server_media_file
                    else {
                        const item: Media_File | undefined =
                            store_view_media_page_info.media_Files_temporary.find(
                                (mediaFile: Media_File) =>
                                    mediaFile.path
                                    ===
                                    store_player_tag_modify.player_current_media_path);
                        const albumArtistsStr =
                            Array.isArray(item.albumArtists) ?
                                item.albumArtists.join('、') : item.albumArtists || '';
                        const artistStr =
                            Array.isArray(item.artist) ?
                                item.artist.join('、') : item.artist || '';
                        const genresStr =
                            Array.isArray(item.genres) ?
                                item.genres.join('、') : item.genres || '';
                        store_player_tag_modify.player_current_media_tag = {
                            title: item?.title,
                            path: item?.path,
                            albumArtists: albumArtistsStr,
                            artist: artistStr,
                            album: item?.album,
                            discCount: item?.disc_number,
                            trackCount: item?.track_number,
                            year: item?.year,
                            genres: genresStr,
                            duration: item?.duration_txt,
                            isCompilation: item?.compilation,

                            codec: item?.suffix,
                            audioBitrate: item?.bit_rate,
                            audioChannels: item?.channels,

                            sizeOnDisk: item?.size,
                            albumPeak: item?.rg_album_peak,
                            trackPeak: item?.rg_track_peak,
                            comment: item?.comment,
                            lyrics: item?.lyrics,
                        }
                    }
                }
            }else if(store_player_tag_modify.player_show_tag_kind === 'album') {

            }else if(store_player_tag_modify.player_show_tag_kind === 'artist') {

            }
        }
        else if(store_server_user_model.model_server_type_of_web){
            /// show(no modify) web media_file_metadata
            if(store_view_media_page_info.media_File_metadata != undefined && store_view_media_page_info.media_File_metadata.length > 0) {
                if (store_player_tag_modify.player_show_tag_kind === 'media') {
                    const item: Media_File | undefined =
                        store_view_media_page_info.media_File_metadata.find(
                            (mediaFile: any) =>
                                mediaFile.id
                                ===
                                store_player_tag_modify.player_current_media_id);
                    const albumArtistsStr =
                        Array.isArray(item.albumArtist) ?
                            item.albumArtists.join('、') : item.albumArtists || '';
                    const artistStr =
                        Array.isArray(item.artist) ?
                            item.artist.join('、') : item.artist || '';
                    const genresStr = Array.isArray(item.genres) ?
                        item.genres.map(genre => genre.name).join('、') :
                        item.genres || '';
                    store_player_tag_modify.player_current_media_tag = {
                        title: item?.title,
                        path: item?.path,
                        albumArtists: albumArtistsStr,
                        artist: artistStr,
                        album: item?.album,
                        discCount: item?.discNumber,
                        trackCount: item?.trackNumber,
                        year: item?.year,
                        genres: genresStr,
                        duration: item?.duration,
                        isCompilation: item?.compilation,

                        codec: item?.suffix,
                        audioBitrate: item?.bitRate,
                        audioChannels: item?.channels,

                        sizeOnDisk: item?.size,
                        albumPeak: item?.rgAlbumPeak,
                        trackPeak: item?.rgTrackPeak,
                        comment: item?.comment,
                        lyrics: item?.lyrics,
                    }
                    //
                    store_player_tag_modify.player_current_media_path = item.path
                    store_player_tag_modify.player_current_media_id = item.id
                    store_player_tag_modify.player_current_media_starred = item.starred || false
                    store_player_tag_modify.player_current_media_playCount = item.playCount
                    store_player_tag_modify.player_current_media_playDate = item.playDate
                } else if (store_player_tag_modify.player_show_tag_kind === 'album') {

                } else if (store_player_tag_modify.player_show_tag_kind === 'artist') {

                }
            }
        }
    }
});