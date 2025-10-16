import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Set_ALL_LocalData } from '@/data/data_repository/app_repository/LocalSqlite_Set_AllLocalData'

export const useLocalDbInfoStore = defineStore('localDbInfo', () => {
  // 状态定义
  const local_config_of_all_user_of_sqlite = ref<Local_Configs_Props[]>([])
  const local_config_of_all_user_of_select = ref<{ label: string; value: string }[]>([])
  const result_local = ref(true)

  // 方法定义
  function set_clear_all_local_data() {
    const set_ALL_LocalData = new Set_ALL_LocalData()
    set_ALL_LocalData.Set_ALL_LocalData_To_Delete()
  }

  return {
    // 状态暴露
    local_config_of_all_user_of_sqlite,
    local_config_of_all_user_of_select,
    result_local,
    // 方法暴露
    set_clear_all_local_data
  }
})