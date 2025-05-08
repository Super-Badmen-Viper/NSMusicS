import {reactive} from "vue";

export const store_server_login_info = reactive({
    server_input_email: '',
    server_input_username: '',
    server_input_password: '',

    server_accessToken: '',
    server_refreshToken: '',
});