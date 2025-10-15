import { reactive } from 'vue'
import { Set_LibraryInfo_To_LocalSqlite } from '@/data/data_repository/app_repository/class_Set_LibraryInfo_To_LocalSqlite'

export const store_local_data_select_logic = reactive({
  /// app update
  async update_local_setFolder(id: string, local_name: string, local_url: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Update_Folder(id, local_name, local_url)
  },

  /// app delete
  async update_local_deleteFolder(id: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Folder(id)
  },
})
