import { Jellyfin_Api_Services_Web } from '../Jellyfin_Api_Services_Web'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { Items_ApiService_of_Je } from '../Items/index_service'

export class UserPlayedItems_ApiService_of_Je extends Jellyfin_Api_Services_Web {
  public async getUserPlayedItems_Quick(
    userId: string,
    itemId: string,
    datePlayed: string
  ): Promise<any> {
    if (store_server_users.server_select_kind === 'jellyfin') {
      return this.sendRequest('POST', `UserPlayedItems/${itemId}`, {
        userId,
        datePlayed,
      })
    } else {
      return this.sendRequest(
        'POST',
        `Users/${store_server_user_model.userid_of_Je}/PlayedItems/${itemId}`,
        {
          datePlayed,
        }
      )

      // Emby服务器的时区问题，少8个小时，且不能设置更新播放日期
      // const { MediaSources } = await new Items_ApiService_of_Je(
      //     store_server_users.server_config_of_current_user_of_sqlite?.url
      // ).getItems_PlaybackInfo(
      //     userId, itemId
      // );
      // const MediaSourceId = MediaSources.length ? MediaSources[0].Id : '';
      // return this.sendRequest(
      //     'POST',
      //     `Users/${store_server_user_model.userid_of_Je}/PlayedItems/${itemId}`,
      //     {
      //         MediaSourceId
      //     }
      // );

      // 设置为未播放，播放次数重置为0
      // await this.sendRequest(
      //     'DELETE',
      //     `Users/${store_server_user_model.userid_of_Je}/PlayedItems/${itemId}`,
      // );
      // // 再设置为播放，不需要获取MediaSourceId，自动刷新播放日期
      // return this.sendRequest(
      //     'POST',
      //     `Users/${store_server_user_model.userid_of_Je}/PlayedItems/${itemId}`,
      // );
    }
  }
}
