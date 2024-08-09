import { reactive } from 'vue'

export const store_player_basic = reactive({
    percentage_of_local: 0,
    percentage_of_nd: 0,

    server_config_of_current_user_of_sqlite: undefined as Server_Configs_Props | undefined,
    server_config_of_all_user_of_sqlite: [] as Server_Configs_Props[],

    server_config_of_current_user_of_select_servername: '',
    server_config_of_current_user_of_select: undefined as { label: string; value: string } | undefined,
    server_config_of_all_user_of_select: [] as { label: string; value: string }[],

    get_server_config_of_all_user_of_sqlite(value: Server_Configs_Props[]) {
        this.server_config_of_all_user_of_sqlite = value;
        this.server_config_of_all_user_of_select = [];
        value.forEach((item) => {
            this.server_config_of_all_user_of_select.push({
                label: item.server_name,
                value: item.id
            });
        });

        const index = this.server_config_of_all_user_of_sqlite.findIndex(item => item.id === this.server_config_of_current_user_of_select?.value);
        if (index === 0) {
            this.server_config_of_current_user_of_sqlite = undefined;
            this.server_config_of_current_user_of_select = undefined;
            this.server_config_of_current_user_of_select_servername = '';
        }
    },
});