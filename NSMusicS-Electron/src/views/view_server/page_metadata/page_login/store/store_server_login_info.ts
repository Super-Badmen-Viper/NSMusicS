import {reactive} from "vue";

export const store_server_login_info = reactive({
    server_input_email: 'test@gmail.com',
    server_input_username: 'TestName',
    server_input_password: 'test123',

    server_accessToken: '',
    server_refreshToken: '',
});