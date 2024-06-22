import { ref, type Ref } from "vue";

export class App_Configs {
  [key: string]: Ref<any>;
  constructor(props: App_Configs_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}