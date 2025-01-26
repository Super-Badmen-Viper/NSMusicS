import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class MusicGenres_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /**
     * 获取所有音乐流派信息
     * @returns 响应数据
     */
    public async getMusicGenres_ALL(): Promise<any> {
        return this.sendRequest(
            'GET',
            'MusicGenres'
        );
    }

    // 获取所有流派
    // 获取选中 - 流派 - 所有专辑：GenreIds(流派id)
    // Items?StartIndex=0&Limit=100&Fields=PrimaryImageAspectRatio%2CSortName%2CPrimaryImageAspectRatio&Recursive=true&SortBy=IsFolder%2CSortName&
    //      GenreIds=d2b41a81a1122b14418c423b2f3616e9&IncludeItemTypes=MusicAlbum&SortOrder=Ascending&ImageTypeLimit=1
    // 获取选中 - 专辑 - 所有乐曲：ParentId(专辑id)
    // Items?ParentId=ed877a2d829cf79ea9a22440eac9ac96&Fields=ItemCounts%2CPrimaryImageAspectRatio%2CCanDelete%2CMediaSourceCount&SortBy=ParentIndexNumber%2CIndexNumber%2CSortName
}