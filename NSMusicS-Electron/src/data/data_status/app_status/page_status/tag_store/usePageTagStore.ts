import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageTagStore = defineStore('pageTag', () => {
  // 使用ref替代reactive管理状态
  const tag_metadata_find_model = ref(false)
  const tag_type_select = ref('media')
  const tag_LibraryItems_metadata = ref<any[]>([])
  const tag_LibraryItems_temporary = ref<any[]>([])

  return {
    tag_metadata_find_model,
    tag_type_select,
    tag_LibraryItems_metadata,
    tag_LibraryItems_temporary,
  }
})