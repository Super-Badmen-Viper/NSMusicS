import {reactive} from "vue";

export const store_server_login_info = reactive({
    server_input_email: 'test@gmail.com',
    server_input_username: 'Test Name',
    server_input_password: 'test',

    server_accessToken: '',
    server_refreshToken: '',
});