import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"
import {store_server_users} from "../../../../../data_stores/server/store_server_users";

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

    // http://localhost:8096/Users/3a992c45695c485c996a291091513934/Items/4ce074653b0dab7d21aa1638e9030e6a
    public async getItems_Info(
        userId: string, itemId: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            `Items/${itemId}`,
            {
                userId
            }
        );
    }
    public async getItems_PlaybackInfo(
        userId: string, itemId: string,
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            `Items/${itemId}/PlaybackInfo`,
            {
                userId
            }
        );
    }

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

    public async getItems_List_Find_Artist_ALL_Album(
        userId: string, albumArtistIds: string,
        sortBy: string, sortOrder: string,
        limit: string, startIndex: string,
        includeItemTypes: string,
        fields: string, recursive: string,
        collapseBoxSetItems: string
    ): Promise<any> {
        return this.sendRequest(
            'GET',
            'Items',
            {
                userId, albumArtistIds,
                sortBy, sortOrder,
                limit, startIndex,
                includeItemTypes,
                fields, recursive,
                collapseBoxSetItems
            }
        );
    }

    public async delItems_List_Quick(
        itemId: string
    ): Promise<any> {
        if(store_server_users.server_select_kind === 'jellyfin') {
            return this.sendRequest(
                'DELETE',
                `Items/${itemId}`
            );
        }else{
            /// BUG of Del-PlayList
            const Ids = itemId
            return this.sendRequest(
                'POST',
                `emby/Items/Delete`,
                {
                    Ids
                }
            );
        }
    }
}