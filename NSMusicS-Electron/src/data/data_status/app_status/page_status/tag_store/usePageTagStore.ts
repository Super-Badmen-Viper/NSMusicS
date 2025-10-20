import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageTagStore = defineStore('pageTag', () => {
  // 使用ref替代reactive管理状态
  const tag_metadata_find_model = ref(false)
  const tag_type_select = ref('media')
  const tag_LibraryItems_metadata = ref<any[]>([])
  const tag_LibraryItems_temporary = ref<any[]>([])

  // 返回状态和方法
  return {
    // 状态
    tag_metadata_find_model,
    tag_type_select,
    tag_LibraryItems_metadata,
    tag_LibraryItems_temporary,

    // 可以在这里添加相关的方法
    // 例如：
    // resetTagData() {
    //   tag_LibraryItems_metadata.value = []
    //   tag_LibraryItems_temporary.value = []
    // }
  }
})
