import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'

// 定义快捷键配置项的接口
interface ShortcutConfig {
  id: string // 快捷键唯一标识，如 "save-file"
  name: string // 快捷键的可读名称，如 "保存文件"
  description?: string // 描述
  keyCombo: string[] // 按键组合，例如 ['ctrl', 's']
  // 其他您需要的元数据...
}

export const useSystemKeyboardListenerStore = defineStore('systemKeyboardListener', () => {
  // 获取保存store的引用
  const systemConfigsSaveStore = useSystemConfigsSaveStore()

  // 状态定义
  const allShortcutConfigs = ref<ShortcutConfig[]>([])
  const activeShortcutMap = ref<Map<string, string[]>>(new Map()) // Map<shortcutId, keyCombo>

  /**
   * 初始化：从持久化存储（如 localStorage 或您的 app config）加载快捷键配置
   */
  async function init() {
    // 为了示例，设置一些默认配置和映射
    allShortcutConfigs.value = [
      { id: 'save-file', name: '保存文件', keyCombo: ['ctrl', 's'] },
      { id: 'toggle-theme', name: '切换主题', keyCombo: ['ctrl', 'shift', 't'] },
      { id: 'show-help', name: '显示帮助', keyCombo: ['f1'] },
      // ... 更多快捷键
    ]

    // 初始化 activeShortcutMap，默认使用标准键位
    allShortcutConfigs.value.forEach((config) => {
      activeShortcutMap.value.set(config.id, config.keyCombo)
    })

    console.log('Keyboard shortcut store initialized.')
  }

  /**
   * 更新某个快捷键的按键组合（用户自定义时调用）
   * @param shortcutId 快捷键ID
   * @param newKeyCombo 新的按键组合数组
   */
  function updateShortcutKey(shortcutId: string, newKeyCombo: string[]) {
    if (!activeShortcutMap.value.has(shortcutId)) {
      console.warn(`Shortcut with ID ${shortcutId} not found.`)
      return
    }
    // 检查 newKeyCombo 是否与其他快捷键冲突...
    // checkForConflicts(shortcutId, newKeyCombo);

    activeShortcutMap.value.set(shortcutId, newKeyCombo)
    // 保存更改到您的配置系统
    saveShortcutConfig()
  }

  /**
   * 将当前的快捷键映射保存到持久化存储
   */
  async function saveShortcutConfig() {
    // 将 Map 转换为普通对象以便存储
    const configToSave = Object.fromEntries(activeShortcutMap.value)
    // 调用保存逻辑，例如保存到 app config 或服务器
    // await systemConfigsSaveStore.save_system_config_of_App_Configs({ shortcuts: configToSave });
    console.log('Shortcut configuration saved.', configToSave)
  }

  /**
   * 根据快捷键ID获取其当前的按键组合
   * @param shortcutId 快捷键ID
   * @returns 按键组合数组，例如 ['ctrl', 's']
   */
  function getKeyCombo(shortcutId: string): string[] {
    return activeShortcutMap.value.get(shortcutId) || []
  }

  /**
   * 根据按键组合反向查找是哪个快捷键（可用于冲突检测和提示）
   * @param keyCombo 按键组合数组
   * @returns 找到的快捷键ID，否则为 undefined
   */
  function getShortcutIdByCombo(keyCombo: string[]): string | undefined {
    const comboStr = keyCombo.join('+').toLowerCase()
    for (const [id, combo] of activeShortcutMap.value.entries()) {
      if (combo.join('+').toLowerCase() === comboStr) {
        return id
      }
    }
    return undefined
  }

  // 暴露状态和方法
  return {
    // 状态
    allShortcutConfigs,
    activeShortcutMap,
    // 方法
    init,
    updateShortcutKey,
    saveShortcutConfig,
    getKeyCombo,
    getShortcutIdByCombo
  }
})

// 初始化这个 store
const keyboardListenerStore = useSystemKeyboardListenerStore()
keyboardListenerStore.init()