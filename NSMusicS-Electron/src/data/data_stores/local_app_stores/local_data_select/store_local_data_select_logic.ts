import { reactive } from 'vue'
import { Set_LocalSqlite_LibraryInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_LibraryInfo'

export const store_local_data_select_logic = reactive({
  /// app update
  async update_local_setFolder(id: string, local_name: string, local_url: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LocalSqlite_LibraryInfo()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Update_Folder(id, local_name, local_url)
  },

  /// app delete
  async update_local_deleteFolder(id: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LocalSqlite_LibraryInfo()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Folder(id)
  },
})
