import { ref, type Ref } from "vue";

export class Player_Configs_of_Audio_Info {
  [key: string]: Ref<any>;
  constructor(props: Player_Configs_of_Audio_Info_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}