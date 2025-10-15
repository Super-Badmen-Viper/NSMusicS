import { reactive } from 'vue'
import { Set_ALL_LocalData } from '@/data/data_app/repository_app/class_Set_ALL_LocalData'

export const store_local_db_info = reactive({
  local_config_of_all_user_of_sqlite: [] as Local_Configs_Props[],
  local_config_of_all_user_of_select: [] as { label: string; value: string }[],

  result_local: true,
  set_clear_all_local_data() {
    const set_ALL_LocalData = new Set_ALL_LocalData()
    set_ALL_LocalData.Set_ALL_LocalData_To_Delete()
  },
})
