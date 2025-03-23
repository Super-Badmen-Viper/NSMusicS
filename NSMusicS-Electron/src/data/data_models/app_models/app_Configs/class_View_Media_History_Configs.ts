import { ref, type Ref } from "vue";

export class View_History_Configs {
  [key: string]: Ref<any>;
  constructor(props: Interface_View_Router_Date) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}