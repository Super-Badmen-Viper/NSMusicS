import { ref, type Ref } from "vue";

export class Player_Configs_of_UI {
  [key: string]: Ref<any>;
  constructor(props: Player_Configs_of_UI_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}