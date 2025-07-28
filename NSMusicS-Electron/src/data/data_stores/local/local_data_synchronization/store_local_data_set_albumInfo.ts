import { reactive } from 'vue'
import { Set_AlbumInfo_To_LocalSqlite } from '@/data/data_configs/local_configs/class_Set_AlbumInfo_To_LocalSqlite'
import { store_server_data_set_albumInfo } from '@/data/data_stores/server/server_api_synchronization/store_server_data_set_albumInfo'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
const set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
export const store_local_data_set_albumInfo = reactive({
  Set_AlbumInfo_To_Favorite(id: string, value: boolean) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Favorite_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_albumInfo.Set_AlbumInfo_To_Favorite_Server(id, value)
    }
  },
  Set_AlbumInfo_To_Rating(id: any, value: number) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_Rating_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_albumInfo.Set_AlbumInfo_To_Rating_Server(id, value)
    }
  },
  Set_AlbumInfo_To_PlayCount_of_Album(item_id: any) {
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album_Local(item_id)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_albumInfo.Set_AlbumInfo_To_PlayCount_of_Album_Server(item_id)
    }
  },
})
