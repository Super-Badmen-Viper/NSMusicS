import { NineSong_Api_Services_Web } from '../../Scene/Music/NineSong_Api_Services_Web'

export class Auth_Token_ApiService_of_NineSong extends NineSong_Api_Services_Web {
  public async getAuth_Token(email: string, password: string): Promise<any> {
    return this.sendRequest(
      'POST',
      'user/login',
      {},
      {
        email,
        password,
      }
    )
  }
}
