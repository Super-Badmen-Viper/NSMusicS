import { defineStore } from 'pinia'
import { Set_LocalSqlite_LibraryInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_LibraryInfo'

export const useLocalDataSelectLogicStore = defineStore('localDataSelectLogic', () => {
  // 方法定义
  async function update_local_setFolder(id: string, local_name: string, local_url: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LocalSqlite_LibraryInfo()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Update_Folder(id, local_name, local_url)
  }

  async function update_local_deleteFolder(id: string) {
    const set_LibraryInfo_To_LocalSqlite = new Set_LocalSqlite_LibraryInfo()
    return set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Folder(id)
  }

  return {
    // 方法暴露
    update_local_setFolder,
    update_local_deleteFolder
  }
})