import { reactive } from 'vue'

export const store_sqlite_table_info = reactive({
    album: 'album',
    annotation: 'annotation',
    artist: 'artist',
    media_file: 'media_file',
    playlist: 'playlist',
    playlist_tracks: 'playlist_tracks',
    switchToMode_Local(){
        this.album = 'album'
        this.annotation = 'annotation'
        this.artist = 'artist'
        this.media_file = 'media_file'
        this.playlist = 'playlist'
        this.playlist_tracks = 'playlist_tracks'
    },
    switchToMode_Navidrome_Api(){
        this.album = 'server_album'
        this.annotation = 'server_annotation'
        this.artist = 'server_artist'
        this.media_file = 'server_media_file'
        this.playlist = 'server_playlist'
        this.playlist_tracks = 'server_playlist_tracks'
    }
})