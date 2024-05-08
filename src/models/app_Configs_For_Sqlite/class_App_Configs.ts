import { ref, type Ref } from "vue";

const defaultValues_App_Configs: Record<string, any> = {
    theme: null,
    router_name: '',
    app_left_menu_select_activeKey: '',
    app_left_menu_collapsed: null,
};

export class App_Configs {
    [key: string]: Ref<any>;
    constructor() {
      Object.entries(defaultValues_App_Configs).forEach(([propertyName, defaultValue]) => {
        this[propertyName] = ref(defaultValue);
      });
    }
}