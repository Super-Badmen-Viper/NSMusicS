import { reactive } from 'vue';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface UpdateInfo {
    version: string;
    url: string;
    changelog: string;
    changelog_explain: string;
    mandatory: boolean;
}

export const store_app_configs_logic_update = reactive<UpdateInfo>({
    version: '',
    url: '',
    changelog: '',
    changelog_explain: '',
    mandatory: false,

    async fetchAndParseXML(xmlUrl: string) {
        try {
            const response = await axios.get(xmlUrl);
            const xmlData = response.data;
            const parser = new XMLParser();
            const result = parser.parse(xmlData);

            const item = result.item;
            this.version = item.version;
            this.url = item.url;
            this.changelog = item.changelog;
            this.changelog_explain = item.changelog_explain;
            this.mandatory = item.mandatory === 'true';
        } catch (error) {
            console.error('Error fetching or parsing XML:', error);
        }
    },

    getVersion(): string {
        return this.version;
    },

    getUrl(): string {
        return this.url;
    },

    getChangelog(): string {
        return this.changelog;
    },
    getChangelog_explain(): string {
        return this.changelog_explain;
    },

    isMandatory(): boolean {
        return this.mandatory;
    }
});