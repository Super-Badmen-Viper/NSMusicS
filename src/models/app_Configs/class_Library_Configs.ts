import { ref, type Ref } from "vue";

export class Library_Configs {
    [key: string]: Ref<any>;
    constructor(props: Library_Configs_Props) {
        const defaultValues: Record<string, any> = props;
        Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
            this[propertyName] = ref(defaultValue);
        });
    }
}