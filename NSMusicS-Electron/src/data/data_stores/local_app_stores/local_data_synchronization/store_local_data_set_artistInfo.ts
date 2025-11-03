import { reactive } from 'vue'
import { Set_LocalSqlite_ArtistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_ArtistInfo'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_server_data_set_artistInfo } from '@/server/server_api_store/server_api_core/annotation/store_server_data_set_artistInfo'
const set_ArtistInfo_To_LocalSqlite = new Set_LocalSqlite_ArtistInfo()
export const store_local_data_set_artistInfo = reactive({
  Set_ArtistInfo_To_Favorite(id: string, value: boolean) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Favorite_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_artistInfo.Set_ArtistInfo_To_Favorite_Server(id, value)
    }
  },
  Set_ArtistInfo_To_Rating(id: any, value: number) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_Rating_Local(id, value)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_artistInfo.Set_ArtistInfo_To_Rating_Server(id, value)
    }
  },
  Set_ArtistInfo_To_PlayCount_of_Artist(item_id: any) {
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_PlayCount_of_Artist_Local(item_id)
    if (store_server_user_model.model_select === 'server') {
      store_server_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist_Server(item_id)
    }
  },
})
