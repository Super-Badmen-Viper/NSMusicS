import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Items_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /*
    sortOrder:
        Ascending、Descending
    SortBy: Album,SortName
        "Default"
        "AiredEpisodeOrder" "Album" "AlbumArtist" "Artist"
        "DateCreated" "OfficialRating"
        "DatePlayed" "PremiereDate" "StartDate" "SortName" "Name"
        "Random" "Runtime" "CommunityRating" "ProductionYear" "PlayCount" "CriticRating"
        "IsFolder" "IsUnplayed" "IsPlayed"
        "SeriesSortName" "VideoBitRate" "AirTime" "Studio"
        "IsFavoriteOrLiked" "DateLastContentAdded" "SeriesDatePlayed"
        "ParentIndexNumber" "IndexNumber" "SimilarityScore" "SearchScore"
    IncludeItemTypes:
        "Audio" "Video" "Folder" "MusicGenre" "Genre" "Movie" "Photo" "Playlist"
        "MusicAlbum" "MusicArtist" "MusicVideo"
        "AggregateFolder" "AudioBook" "BasePluginFolder" "Book" "BoxSet" "Channel"
        "ChannelFolderItem" "CollectionFolder" "Episode" "ManualPlaylistsFolder"
        "LiveTvChannel" "LiveTvProgram" "Person" "PhotoAlbum" "PlaylistsFolder"
        "Program" "Recording" "Season" "Series" "Studio" "Trailer" "TvChannel" "TvProgram"
        "UserRootFolder" "UserView" "Year"
     */

    // SortBy=Album,SortName SortOrder=Ascending IncludeItemTypes=Audio
    // Fields=ParentId EnableImageTypes=Primary
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79
    public async getItems_SongList(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string
    ): Promise<any> {
        return this.sendRequest(`/Items`, {
            userId, parentId, searchTerm,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, enableImageTypes, recursive, imageTypeLimit
        });
    }
    // IncludeItemTypes=MusicAlbum
    // SortBy=SortName SortOrder=Ascending
    // Fields=PrimaryImageAspectRatio,SortName EnableImageTypes=Primary,Backdrop,Banner,Thumb
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79
    public async getItems_AlbumList(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string
    ): Promise<any> {
        return this.sendRequest(`/Items`, {
            userId, parentId, searchTerm,
            sortBy, sortOrder,
            limit, startIndex,
            includeItemTypes,
            fields, enableImageTypes, recursive, imageTypeLimit
        });
    }


}