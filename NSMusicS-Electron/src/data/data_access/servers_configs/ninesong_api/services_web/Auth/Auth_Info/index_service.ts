import {NineSong_Api_Services_Web} from "../../Scene/Music/NineSong_Api_Services_Web";

export class Auth_Info_ApiService_of_NineSong extends NineSong_Api_Services_Web {
    public async setAuth_Username(
        name: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'user/name',
            {},
            {
                email,
            }
        );
    }
    public async setAuth_Email(
        email: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'user/email',
            {},
            {
                email,
            }
        );
    }
    public async setAuth_Password(
        old_password: string, new_password: string,
    ): Promise<any> {
        return this.sendRequest(
            'POST',
            'user/password',
            {},
            {
                old_password,
                new_password,
            }
        );
    }
}