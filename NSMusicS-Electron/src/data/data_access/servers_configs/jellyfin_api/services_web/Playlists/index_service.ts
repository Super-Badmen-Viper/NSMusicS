import {Jellyfin_Api_Services_Web} from "../Jellyfin_Api_Services_Web"

export class Playlists_ApiService_of_Je extends Jellyfin_Api_Services_Web {
    /**
     * 创建播放列表
     * @param name 播放列表名称
     * @param ids 媒体项 ID 列表（逗号分隔）
     * @param mediaType 媒体类型
     * @returns 响应数据
     */
    public async postPlaylists_Create(
        name: string, ids: string, mediaType: string
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'Playlists',
            { Name: name, Ids: ids, MediaType: mediaType } // 查询参数
        );
    }

    /**
     * 获取播放列表详情
     * @param playlistId 播放列表 ID
     * @returns 响应数据
     */
    public async getPlaylists_id(playlistId: string): Promise<any> {
        return this.sendRequest(
            'GET',
            `Playlists/${playlistId}`
        );
    }

    /**
     * 向播放列表添加媒体项
     * @param playlistId 播放列表 ID
     * @param ids 媒体项 ID 列表（逗号分隔）
     * @returns 响应数据
     */
    public async postPlaylists_Add(playlistId: string, ids: string): Promise<any> {
        return this.sendRequest(
            'POST',
            `Playlists/${playlistId}/Items`,
            { ids } // 查询参数
        );
    }

    /**
     * 从播放列表移除媒体项
     * @param playlistId 播放列表 ID
     * @param entryIds 媒体项 ID 列表（逗号分隔）
     * @returns 响应数据
     */
    public async delPlaylists_Remove(playlistId: string, entryIds: string): Promise<any> {
        return this.sendRequest(
            'DELETE',
            `Playlists/${playlistId}/Items`,
            { entryIds } // 查询参数
        );
    }
}