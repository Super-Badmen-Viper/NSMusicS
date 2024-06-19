import { ref, type Ref } from "vue";

interface App_Configs_Props {
  theme: any,
  lang: any,
  router_name: string,
  app_left_menu_select_activeKey: string,
  app_left_menu_collapsed: any,
};

export class App_Configs {
  [key: string]: Ref<any>;
  constructor(props: App_Configs_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}