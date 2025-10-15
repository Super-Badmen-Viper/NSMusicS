// store_system_keyboard_listener.ts
import { reactive, watch } from 'vue'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save' // 您的保存逻辑

// 定义快捷键配置项的接口
interface ShortcutConfig {
  id: string // 快捷键唯一标识，如 "save-file"
  name: string // 快捷键的可读名称，如 "保存文件"
  description?: string // 描述
  keyCombo: string[] // 按键组合，例如 ['ctrl', 's']
  // 其他您需要的元数据...
}

export const store_system_keyboard_listener = reactive({
  // 当前所有可用的快捷键配置列表
  allShortcutConfigs: [] as ShortcutConfig[],

  // 当前激活的快捷键映射（从 allShortcutConfigs 生成或从用户设置加载）
  activeShortcutMap: new Map<string, string[]>(), // Map<shortcutId, keyCombo>

  /**
   * 初始化：从持久化存储（如 localStorage 或您的 app config）加载快捷键配置
   */
  async init() {
    // 1. 这里假设您有一个从配置中加载快捷键列表的方法。
    // 它可能来自一个默认的配置文件，或者您之前保存的用户自定义设置。
    // 例如：this.allShortcutConfigs = await loadShortcutConfigsFromSomewhere();

    // 2. 加载用户自定义的键位映射（如果有）
    // const userKeyMap = await loadUserKeyMapFromSomewhere();
    // this.activeShortcutMap = new Map(Object.entries(userKeyMap));

    // 为了示例，我们设置一些默认配置和映射
    this.allShortcutConfigs = [
      { id: 'save-file', name: '保存文件', keyCombo: ['ctrl', 's'] },
      { id: 'toggle-theme', name: '切换主题', keyCombo: ['ctrl', 'shift', 't'] },
      { id: 'show-help', name: '显示帮助', keyCombo: ['f1'] },
      // ... 更多快捷键
    ]

    // 初始化 activeShortcutMap，默认使用标准键位
    this.allShortcutConfigs.forEach((config) => {
      this.activeShortcutMap.set(config.id, config.keyCombo)
    })

    console.log('Keyboard shortcut store initialized.')
  },

  /**
   * 更新某个快捷键的按键组合（用户自定义时调用）
   * @param shortcutId 快捷键ID
   * @param newKeyCombo 新的按键组合数组
   */
  updateShortcutKey(shortcutId: string, newKeyCombo: string[]) {
    if (!this.activeShortcutMap.has(shortcutId)) {
      console.warn(`Shortcut with ID ${shortcutId} not found.`)
      return
    }
    // 检查 newKeyCombo 是否与其他快捷键冲突...
    // checkForConflicts(shortcutId, newKeyCombo);

    this.activeShortcutMap.set(shortcutId, newKeyCombo)
    // 保存更改到您的配置系统
    this.saveShortcutConfig()
  },

  /**
   * 将当前的快捷键映射保存到持久化存储
   */
  async saveShortcutConfig() {
    // 将 Map 转换为普通对象以便存储
    const configToSave = Object.fromEntries(this.activeShortcutMap)
    // 调用您的保存逻辑，例如保存到 app config 或服务器
    // await store_system_configs_save.save_system_config_of_App_Configs({ shortcuts: configToSave });
    console.log('Shortcut configuration saved.', configToSave)
  },

  /**
   * 根据快捷键ID获取其当前的按键组合
   * @param shortcutId 快捷键ID
   * @returns 按键组合数组，例如 ['ctrl', 's']
   */
  getKeyCombo(shortcutId: string): string[] {
    return this.activeShortcutMap.get(shortcutId) || []
  },

  /**
   * 根据按键组合反向查找是哪个快捷键（可用于冲突检测和提示）
   * @param keyCombo 按键组合数组
   * @returns 找到的快捷键ID，否则为 undefined
   */
  getShortcutIdByCombo(keyCombo: string[]): string | undefined {
    const comboStr = keyCombo.join('+').toLowerCase()
    for (const [id, combo] of this.activeShortcutMap.entries()) {
      if (combo.join('+').toLowerCase() === comboStr) {
        return id
      }
    }
    return undefined
  },
})

// 可选：初始化这个 store
store_system_keyboard_listener.init()

// 您可以监听其他需要重置快捷键配置的情况
// watch(
//   () => someCondition,
//   () => {
//     store_system_keyboard_listener.init();
//   }
// );

/*

<template>
  <!-- 您的组件内容 -->
  <!-- 使用 v-shortkey 指令，其值是从 store 中获取的按键组合数组 -->
  <!-- 使用 @shortkey 事件监听器来触发处理函数 -->
  <div
    v-shortkey="getShortcutKeyCombo('save-file')"
    @shortkey="handleSave"
    tabindex="-1" <!-- 使 div 可聚焦，以便接收键盘事件 -->
    style="outline: none;" <!-- 移除焦点轮廓 -->
  >
    <!-- 组件UI -->
  </div>

  <button
    v-shortkey="getShortcutKeyCombo('toggle-theme')"
    @shortkey="toggleTheme"
  >
    切换主题 (快捷键: {{ formatKeyCombo(getShortcutKeyCombo('toggle-theme')) }})
  </button>

  <!-- 在输入框等元素上，可以使用 v-shortkey-avoid 防止快捷键冲突 -->
  <input v-shortkey-avoid type="text" placeholder="在这里输入不会触发全局快捷键" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { store_system_keyboard_listener } from '@/data/data_stores/local_system_stores/store_system_keyboard_listener';
import { store_system_configs_theme } from '@/data/data_stores/local_system_stores/store_system_configs_theme'; // 您的主题store

// 获取指定快捷键的当前键位组合
const getShortcutKeyCombo = (shortcutId: string) => {
  return store_system_keyboard_listener.getKeyCombo(shortcutId);
};

// 格式化按键组合用于显示（例如：Ctrl+S）
const formatKeyCombo = (combo: string[]) => {
  return combo.map(key => key.charAt(0).toUpperCase() + key.slice(1)).join('+');
};

// 快捷键处理函数
const handleSave = (event: KeyboardEvent) => {
  event.preventDefault(); // 阻止浏览器默认行为（如保存网页）
  console.log('Save triggered by shortcut');
  // 调用您的保存逻辑...
};

const toggleTheme = (event: KeyboardEvent) => {
  event.preventDefault();
  store_system_configs_theme.theme_mode_change_click();
  console.log('Theme toggled by shortcut');
};
</script>

 */

/*

<!-- ShortcutSettings.vue -->
<template>
  <div v-for="config in store.allShortcutConfigs" :key="config.id">
    <label>{{ config.name }}</label>
    <!-- 这里可以是一个用于捕获新键位的输入框组件 -->
    <input
      :value="formatKeyCombo(store.getKeyCombo(config.id))"
      @keydown="(e) => assignNewKey(config.id, e)"
      readonly
      placeholder="Press a new key combination..."
    />
  </div>
</template>

<script setup lang="ts">
import { store_system_keyboard_listener as store } from '@/data/data_stores/local_system_stores/store_system_keyboard_listener';

const assignNewKey = (shortcutId: string, event: KeyboardEvent) => {
  event.preventDefault();
  const keys = [];
  if (event.ctrlKey) keys.push('ctrl');
  if (event.altKey) keys.push('alt');
  if (event.shiftKey) keys.push('shift');
  if (event.metaKey) keys.push('meta');
  // 添加按下的主键，排除修饰键本身
  if (!['Control', 'Alt', 'Shift', 'Meta'].includes(event.key)) {
    keys.push(event.key.toLowerCase());
  }
  // 调用 store 的方法更新键位
  store.updateShortcutKey(shortcutId, keys);
};

// 格式化按键组合用于显示（例如：Ctrl+S）
const formatKeyCombo = (combo: string[]) => {
  return combo.map(key => key.charAt(0).toUpperCase() + key.slice(1)).join('+');
};
</script>


 */
