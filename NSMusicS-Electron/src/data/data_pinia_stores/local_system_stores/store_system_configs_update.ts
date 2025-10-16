import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'

export const useSystemConfigsUpdateStore = defineStore('systemConfigsUpdate', () => {
  // 状态定义
  const version = ref('')
  const url = ref('')
  const changelog = ref('')
  const changelog_explain = ref('')
  const mandatory = ref(false)

  // 方法定义
  async function fetchAndParseXML(xmlUrl: string) {
    try {
      const response = await axios.get(xmlUrl)
      const xmlData = response.data
      const parser = new XMLParser()
      const result = parser.parse(xmlData)

      const item = result.item
      version.value = item.version
      url.value = item.url
      changelog.value = item.changelog
      changelog_explain.value = item.changelog_explain
      mandatory.value = item.mandatory === 'true'
    } catch (error) {
      console.error('Error fetching or parsing XML:', error)
    }
  }

  function getVersion(): string {
    return version.value
  }

  function getUrl(): string {
    return url.value
  }

  function getChangelog(): string {
    return changelog.value
  }

  function getChangelog_explain(): string {
    return changelog_explain.value
  }

  function isMandatory(): boolean {
    return mandatory.value
  }

  // 暴露状态和方法
  return {
    // 状态
    version,
    url,
    changelog,
    changelog_explain,
    mandatory,
    // 方法
    fetchAndParseXML,
    getVersion,
    getUrl,
    getChangelog,
    getChangelog_explain,
    isMandatory
  }
})