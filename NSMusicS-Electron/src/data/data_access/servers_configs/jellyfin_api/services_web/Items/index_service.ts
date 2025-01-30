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
    filters:
        "IsFolder" "IsNotFolder"
        "IsUnplayed" "IsPlayed"
        "IsFavorite" "IsResumable"
        "Likes" "Dislikes" "IsFavoriteOrLikes"
    IncludeItemTypes:
        "Audio" "Video" "Folder" "MusicGenre" "Genre" "Movie" "Photo" "Playlist"
        "MusicAlbum" "MusicArtist" "MusicVideo"
        "AggregateFolder" "AudioBook" "BasePluginFolder" "Book" "BoxSet" "Channel"
        "ChannelFolderItem" "CollectionFolder" "Episode" "ManualPlaylistsFolder"
        "LiveTvChannel" "LiveTvProgram" "Person" "PhotoAlbum" "PlaylistsFolder"
        "Program" "Recording" "Season" "Series" "Studio" "Trailer" "TvChannel" "TvProgram"
        "UserRootFolder" "UserView" "Year"
     */

    // IncludeItemTypes=Audio
    // SortBy=Album,SortName SortOrder=Ascending
    // Fields=ParentId EnableImageTypes=Primary
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79
    public async getItems_List(
        userId: string, parentId: string, searchTerm: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        years: string, filters: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId, parentId, searchTerm,
                sortBy, sortOrder,
                limit, startIndex,
                includeItemTypes,
                fields, enableImageTypes, recursive, imageTypeLimit,
                years, filters
            }
        );
    }
    // IncludeItemTypes=MusicAlbum
    // SortBy=SortName SortOrder=Ascending
    // Fields=PrimaryImageAspectRatio,SortName EnableImageTypes=Primary,Backdrop,Banner,Thumb
    // StartIndex=0 Limit=100
    // ImageTypeLimit=1 Recursive=true
    // ParentId=28e9960207c978c0d9aaefc8ae2d3a79

    public async getItems_List_Last(
        userId: string, parentId: string,
        limit: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        filters: string, enableTotalRecordCount: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items/Latest',
            {
                userId, parentId,
                limit,
                includeItemTypes,
                fields, enableImageTypes, recursive, imageTypeLimit,
                filters, enableTotalRecordCount
            }
        );
    }

    public async getItems_List_Home_Filters(
        userId: string, parentId: string,
        sortBy: string, sortOrder: string,
        limit: string,
        includeItemTypes: string,
        fields: string, enableImageTypes: string, recursive: string, imageTypeLimit: string,
        filters: string, enableTotalRecordCount: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId, parentId,
                sortBy, sortOrder,
                limit,
                includeItemTypes,
                fields, enableImageTypes, recursive, imageTypeLimit,
                filters, enableTotalRecordCount
            }
        );
    }

    public async getItems_List_Quick_Filters(
        userId: string, parentId: string,
        includeItemTypes: string,
        Fields: string,
        filters: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId, parentId,
                includeItemTypes,
                Fields,
                filters
            }
        );
    }

    public async delItems_List_Quick(
        itemId: string
    ): Promise<any> {
        return this.sendRequest(
            'DELETE',
            `Items/${itemId}`
        );
    }
}