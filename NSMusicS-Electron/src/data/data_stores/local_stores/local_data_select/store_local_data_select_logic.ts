import { reactive } from 'vue'
import { Set_LibraryInfo_To_LocalSqlite } from '@/data/data_app/repository_app/class_Set_LibraryInfo_To_LocalSqlite'

export const store_local_data_select_logic = reactive({
  /// server update
  async update_local_setFolder(id: string, local_name: string, local_url: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Update_Folder(id, local_name, local_url)
  },

  /// server delete
  async update_local_deleteFolder(id: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Folder(id)
  },
})
