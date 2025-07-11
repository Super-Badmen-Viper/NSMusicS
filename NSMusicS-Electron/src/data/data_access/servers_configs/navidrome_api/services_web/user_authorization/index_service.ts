import { Navidrome_Api_Services_Web } from '../Navidrome_Api_Services_Web'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import axios from 'axios'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'

export class User_Authorization_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
  public async get_token() {
    const url = store_server_users.server_config_of_current_user_of_sqlite?.url + '/auth/login'
    const data = {
      username: store_server_users.server_config_of_current_user_of_sqlite?.user_name,
      password: store_server_users.server_config_of_current_user_of_sqlite?.password,
    }
    const headers = {
      'content-type': 'application/json',
    }
    try {
      const response = await axios.post(url, data, { headers })
      store_server_user_model.authorization_of_nd = response.data.token
      store_server_user_model.client_unique_id = response.data.id
    } catch (error: any) {
      console.error('Error inserting data:', error)
      return false
    }
    return true
  }
}
